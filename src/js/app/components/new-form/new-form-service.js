
angular.module(
        'NewFormServiceModule',
        [
            'ngResource'
        ]
    )
    .factory(
    'NewFormService',
    function ($resource) {
        return $resource(
            'https://jsonplaceholder.typicode.com/posts/:id',
            {id: '@id'},
            {
                send: {
                    method: 'PUT'
                }
            }
        );
    }
);
