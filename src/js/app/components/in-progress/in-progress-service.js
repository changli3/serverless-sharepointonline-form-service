angular.module(
        'InProgressServiceModule',
        [
            'ngResource'
        ]
    )
    .factory(
    'InProgressService',
    function ($resource) {
        return $resource(
            'https://jsonplaceholder.typicode.com/users',
            {},
            {
                query: {
                    method: 'GET', isArray:true
                }
            }
        );
    }
);
