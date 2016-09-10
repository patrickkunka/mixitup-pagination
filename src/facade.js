/* global mixitup */

mixitup.Facade.registerAction('afterConstruct', 'pagination', function(mixer) {
    this.paginate = mixer.paginate.bind(mixer);
    this.nextPage = mixer.nextPage.bind(mixer);
    this.prevPage = mixer.prevPage.bind(mixer);
});