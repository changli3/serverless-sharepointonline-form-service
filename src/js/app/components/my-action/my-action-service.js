
angular.module(
        'MyActionServiceModule',
        [
            'ngResource'
        ]
    )
    .factory(
    'MyActionService',
    function ($resource) {
        return $resource(
            'https://jsonplaceholder.typicode.com/posts',
            {},
            {
                query: {
                    method: 'GET',
                    isArray: true
                }
            }
        );
    }
);
