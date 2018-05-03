/* global angular */

/**
 * @ngdoc object
 * @name MenuMainModel
 * @function
 * @description
 *
 * This is the model for the main menu.
 *
 * @note Because the code structure is tightly linked to the menu structure,
 * the menu items are defined here, rather than retrieving them from a service.
 *
 */

angular.module(
        'MenuMainModelModule',
        [
        ]
    )
    .factory(
    'MenuMainModel',
    function () {
        var 
            _currentMenuItemId = 0,
            _menuItems = [
                {
                    'id': 0,
                    'text': 'In-progress',
                    'url': '#/in-progress'
                },
                {
                    'id': 1,
                    'text': 'Require My Action',
                    'url': '#/my-action'
                },
                {
                    'id': 2,
                    'text': 'Submitted for Approval',
                    'url': '#/submitted'
                },
                {
                    'id': 3,
                    'text': 'Completed Forms',
                    'url': '#/archive'
                },
                {
                    'id': 4,
                    'text': '',
                    'url': '#/new-form'
                }
            ];

        return {
            getCurrentMenuItemId: function () {
                return _currentMenuItemId;
            },

            setCurrentMenuItemId: function (newCurrentMenuItemId) {
                _currentMenuItemId = newCurrentMenuItemId;
            },

            getMenuItems: function () {
                return _menuItems;
            }
        };
    }
);
