import { TestBed } from '@angular/core/testing';
import { EventAdminService } from './event-admin.service';
import { AuthService } from 'app/auth/auth.service';
import { Firestore, collection, doc, getDoc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadString, deleteObject } from '@angular/fire/storage';
import { of } from 'rxjs';
import { OEvent, EventSummary, CourseSummary, EventGrades } from 'app/events/model/oevent';
import { Results } from 'app/results/model';
import { UserData } from 'app/user/user';


describe('EventAdminService', () => {
    let service: EventAdminService;
    let mockAuthService: jasmine.SpyObj<AuthService>;
    let mockFirestore: jasmine.SpyObj<Firestore>;
    let mockStorage: jasmine.SpyObj<Storage>;

    const testEvent: OEvent = {
        name: 'Test Event',
        date: new Date(),
        key: 'testKey',
        userId: 'testUser',
        grade: 'Local',
        summary: null,
        splits: {
            splitsFilename: 'results/testUser/testKey-results',
            splitsFileFormat: 'IOFv3',
            valid: true,
            uploadDate: new Date()
        },
        yearIndex: 2024,
        gradeIndex: { brown: true }

    };

   const testResults: Partial<Results> = {
        courses: [],
        classes: [],
        needsRepair: () => false,
        determineTimeLosses: () => { },
        findCompetitors: () => [],
        findCourseClasss: () => [],
        findCourses: () => [],
        warnings: []
    };

    beforeEach(() => {
        mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['user', 'isAdmin']);
        mockFirestore = jasmine.createSpyObj<Firestore>('Firestore', ['collection', 'doc', 'getDoc', 'setDoc', 'deleteDoc']);
        mockStorage = jasmine.createSpyObj<Storage>('Storage', ['ref', 'uploadString', 'deleteObject']);

        TestBed.configureTestingModule({
            providers: [
                EventAdminService,
                { provide: AuthService, useValue: mockAuthService },
                { provide: Firestore, useValue: mockFirestore },
                { provide: Storage, useValue: mockStorage },
            ],
        });
        service = TestBed.inject(EventAdminService);

    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });


    it('should map event dates correctly', () => {
        const firestoreTimestamp = { toDate: () => new Date(2024, 5, 10) }; // Mock Firestore timestamp
        const fsEvents = [{ dateSubmitted: firestoreTimestamp, name: 'Event 1' }];
        const events = service.mapEvent(fsEvents as any[]);
        expect(events[0].date).toEqual(new Date(2024, 5, 10));
    });


    it('should update event', async () => {

        mockFirestore.doc.and.returnValue({ id: testEvent.key });
        mockFirestore.setDoc.and.returnValue(Promise.resolve());


        await service.update(testEvent.key, testEvent);


        expect(mockFirestore.setDoc).toHaveBeenCalledWith(
            jasmine.any(Object),
            testEvent,
            { merge: true }
        );
    });


    it("should get event by key", async () => {
        const mockDocumentReference = {} as any;
        const mockDocumentSnapshot = { data: () => testEvent } as any;


        mockFirestore.doc.and.returnValue(mockDocumentReference);
        mockFirestore.getDoc.and.returnValue(Promise.resolve(mockDocumentSnapshot));

        const event = await service.getEvent(testEvent.key);
        expect(event).toEqual(testEvent);
    });

    it('should add event', async () => {

        mockFirestore.collection.and.returnValue({ doc: () => ({ id: 'newKey' }) } as any);
        mockFirestore.setDoc.and.returnValue(Promise.resolve());
        mockAuthService.user.and.returnValue({ uid: 'newUser' } as UserData);

        const newEvent = await service.add({ name: 'New Event' } as Partial<OEvent>);

        expect(newEvent.key).toBe('newKey');
        expect(newEvent.userId).toBe('newUser');
        expect(mockFirestore.setDoc).toHaveBeenCalledWith(
            jasmine.any(Object),
            newEvent

        );

    });


    it('should delete event and results file', async () => {
        mockFirestore.doc.and.returnValue({} as any);
        mockFirestore.deleteDoc.and.returnValue(Promise.resolve());
        mockStorage.ref.and.returnValue({} as any);
        mockStorage.deleteObject.and.returnValue(Promise.resolve());

        await service.delete(testEvent);

        expect(mockFirestore.deleteDoc).toHaveBeenCalledWith(jasmine.any(Object));
        expect(mockStorage.deleteObject).toHaveBeenCalledWith(jasmine.any(Object));
    });


    it('should upload results successfully', async () => {
        spyOn(service, 'loadTextFile').and.returnValue(Promise.resolve('test,csv,data'));
        spyOn(service, 'parseSplits').and.returnValue(testResults);
        spyOn(service, 'populateSummary').and.returnValue({ numcompetitors: 0, courses: [] } as EventSummary);
        mockStorage.ref.and.returnValue({} as any);
        spyOn<any>(service, '_uploadToGoogle').and.returnValue(Promise.resolve());
        mockFirestore.setDoc.and.returnValue(Promise.resolve());
        mockAuthService.user.and.returnValue({ uid: 'testUser' } as any);


        const eventCopy = { ...testEvent, splits: { ...testEvent.splits } };
        const results = await service.uploadResults(eventCopy, new File([], 'test.csv'));


        expect(service.loadTextFile).toHaveBeenCalled();
        expect(service.parseSplits).toHaveBeenCalledWith('test,csv,data');
        expect(eventCopy.splits.splitsFilename).toBe('results/testUser/testKey-results');
        expect(eventCopy.splits.valid).toBe(true);

    });





    it('should populate summary correctly', () => {
        const mockResults: Results = {
            name: 'Test Event',
            courses: [
                { name: 'Course 1', length: 1000, climb: 50, classes: [{ name: 'Class A', competitors: [1, 2] }] },
                { name: 'Course 2', length: 1500, climb: 75, classes: [{ name: 'Class B', competitors: [3, 4, 5] }] },
            ],
            classes: [],
            date: new Date(),
            needsRepair: () => false,
            determineTimeLosses: () => { },
            findCompetitors: () => [],
            findCourseClasss: () => [],
            findCourses: () => [],
            warnings: []
        } as any;


        const summary = service.populateSummary(mockResults);


        expect(summary.numcompetitors).toBe(5);
        expect(summary.courses.length).toBe(2);
        expect(summary.courses[0].name).toBe('Course 1');
        expect(summary.courses[0].numcompetitors).toBe(2);
        expect(summary.courses[1].name).toBe('Course 2');
        expect(summary.courses[1].numcompetitors).toBe(3);
    });

    it('should create course summary', () => {
        const course = { name: 'Course 1', length: 1000, climb: 50 } as any;
        const summary = service.createCourseSummary(course);

        expect(summary.name).toEqual('Course 1');
        expect(summary.length).toEqual(1000);
        expect(summary.climb).toEqual(50);

    });

});