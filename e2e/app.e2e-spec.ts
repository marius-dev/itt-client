import { IttClientPage } from './app.po';

describe('itt-client App', function() {
  let page: IttClientPage;

  beforeEach(() => {
    page = new IttClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
