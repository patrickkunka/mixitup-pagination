/* global mixitup */

mixitup.Facade.addAction('construct', 'pagination', function(mixer) {
    this.paginate = mixer.paginate.bind(mixer);
    this.nextPage = mixer.nextPage.bind(mixer);
    this.prevPage = mixer.prevPage.bind(mixer);
}, 1);