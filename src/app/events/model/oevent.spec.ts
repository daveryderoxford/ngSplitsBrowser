import { EventGrades } from './oevent';

describe('OEvent model object', () => {

    it('grade index for properties for local event', () => {

        expect(EventGrades.indexObject("Local")).toEqual({
            IOF: true,
            International: true,
            National: true,
            Regional: true,
            Club: true,
            Local: true
        });
    });

    it('grade index for properties for regional event', () => {

        expect(EventGrades.indexObject("Regional")).toEqual({
            Club: true,
            Local: true,
            Regional: true,
        });
    });

    it('grade index for properties for IOF event', () => {

        expect(EventGrades.indexObject("IOF")).toEqual({
            IOF: true,
        });
    });
});
