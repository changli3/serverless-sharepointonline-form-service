
angular.module(
        'SubmittedServiceModule',
        [
            'ngResource'
        ]
    )
    .factory(
    'SubmittedService',
    function ($resource) {
        return $resource(
            'https://jsonplaceholder.typicode.com/users',
            {},
            {
                query: {
                    method: 'GET', isArray: true
                }
            }
        );
    }
);
