const routes = require('next-routes')(); 

routes
    .add('/manuscript/:address', '/manuscript/show')
    .add('/manuscript/:address/newreview', ('/manuscript/newreview'))
    .add('/manuscript/:address/newreviewer', ('/manuscript/newreviewer'))
    .add('/author/new', '/author/new');

module.exports = routes;