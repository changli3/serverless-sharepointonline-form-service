
angular.module(
        'ArchiveServiceModule',
        [
            'ngResource'
        ]
    )
    .factory(
    'ArchiveService',
    function ($resource) {
        return $resource(
            'https://jsonplaceholder.typicode.com/comments',
            {},
            {
                query: {
                    method: 'GET', isArray: true
                }
            }
        );
    }
);
