(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;
//ovde u vm on puni sto je nasao na formi u kontroleru.
        vm.register = register;

        function register() {
            vm.dataLoading = true;

            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');

                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }


    }

})();
