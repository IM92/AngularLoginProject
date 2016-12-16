(function(){
var app = angular.module("app",[]);

app.controller("MainController" , function($scope, StartUsers){
    // inicijalizacija pocetnih vrednosti iz provajdera
    if (!localStorage.users)     
        localStorage.users = JSON.stringify(StartUsers);

    // punimo niz za pocetno stampanje liste
    $scope.users = getUsers();

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


app.provider('StartUsers', function() {
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

})();