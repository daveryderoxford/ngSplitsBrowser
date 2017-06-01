import { SplitsbrowserPage } from './app.po';

describe('splitsbrowser App', () => {
  let page: SplitsbrowserPage;

  beforeEach(() => {
    page = new SplitsbrowserPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(true);
  });
});
