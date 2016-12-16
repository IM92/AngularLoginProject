(function () {
    'use strict';
    
    var mod = angular.module('app');

    mod.factory('UserService', UserService);

    UserService.$inject = ['$timeout', '$filter', '$q'];
    function UserService($timeout, $filter, $q) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getUsers());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { id: id });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function GetByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { username: username });
            var user = filtered.length ? filtered[0] : null;
            deferred.resolve(user);
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByUsername(user.username)
                    .then(function (duplicateUser) {
                        if (duplicateUser !== null) {
                            deferred.resolve({ success: false, message: 'Username "' + user.username + '" is already taken' });
                        } else {
                            var users = getUsers();

                            // assign id
                            var lastUser = users[users.length - 1] || { id: 0 };
                            user.id = lastUser.id + 1;

                            // save to local storage
                            users.push(user);
                            setUsers(users);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(user) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user;
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getUsers() {
            if(!localStorage.users){
                localStorage.users = JSON.stringify([]);
            }

            return JSON.parse(localStorage.users);
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }

    }

    
    mod.provider('SuperUser', function() {
        this.$get = function() {
            var user = {};

            user['firstName'] = "super";
            user['lastName'] = "super";
            user['username'] = "admin";
            user['password'] = "super";
            user["tip"] = 1;

            return user;
        }

    });
/*
    mod.controller('main_cont', function($scope, SuperUser) {
        if (!localStorage.users) {
            var user = SuperUser;
            var users = [];

            var lastUser = users[users.length - 1] || { id: 0 };
            user.id = lastUser.id + 1;
        
            users.push(user);        
            localStorage.users = JSON.stringify(users);
        }
    });
*/

mod.controller("MainController" , function($scope, SuperUser){
    // inicijalizacija pocetnih vrednosti iz provajdera
    if (!localStorage.users)  {
            var user = SuperUser;
            var users = [];

            var lastUser = users[users.length - 1] || { id: 0 };
            user.id = lastUser.id + 1;
        
            users.push(user);        
            localStorage.users = JSON.stringify(users);
        }   
       // localStorage.users = JSON.stringify(SuperUser);

    // punimo niz za pocetno stampanje liste
   // $scope.users = getUsers();

    $scope.addNew = function(user){
        if ($scope.current.name || $scope.current.lastName) {
            var users = getUsers();
            var lastUser = users[users.length - 1] || { id: 0 };
            user.id = lastUser.id + 1;

            users.push(user);
    
            setUsers(users);    
        }  
        else
            $scope.current.greska = "Morate uneti bar jedno polje!";
   };

    $scope.remove = function(user){
        Delete(user);
    };

    $scope.edit = function(user){
       $scope.current = user;
      
    };

    $scope.save = function(user){
        Update(user);
    }

    $scope.current = {};

    function getUsers() {
        if(!localStorage.users){
            localStorage.users = JSON.stringify([]);
        }

        return JSON.parse(localStorage.users);
    }

    function setUsers(users) {
        localStorage.users = JSON.stringify(users);

        $scope.users = users;
        $scope.current = {};
    }  

    function Update(user) {
        var users = getUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].id === user.id) {
                users[i].name = user.name;
                users[i].lastName = user.lastName;
                break;
            }
        }
        
        setUsers(users);
    }

    function Delete(user) {
        var users = getUsers();

        for (var i = 0; i < users.length; i++) {
            var temp_user = users[i];
            if (user.id === temp_user.id) {
                users.splice(i, 1);
                break;
            }
        }
        
        setUsers(users);
    }  
});

})();