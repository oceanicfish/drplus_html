/**
 * Created by yangwei on 10/3/15.
 */
var app = angular.module('indexApp', ['ngCookies']);

app.controller('indexController',[ '$http', '$scope', '$httpParamSerializer', '$cookies', function($http, $scope, $httpParamSerializer, $cookies){

    $scope.user = $cookies.getObject('user');
    console.log($scope.user);

    $scope.username = '';
    $scope.password = '';
    $scope.rememberMe = false;

    //*** Separator ****** Separator ****** Separator ****** Separator ****** Separator ****** Separator ***//

    /**
     * login
     */
    $scope.login = function () {

        /**
         * password type oauth grant configuration
         * @type {{grant_type: string, username: string, password: string, scope: string, client_id: string}}
         */
        $scope.grant_password = {
            grant_type : "password",
            username : $scope.username,
            password : $scope.password,
            // password : "$2a$10$Zl.JibB3Q0MDNzJozg.DKufpAQFXMmDKqmYwenENUnoK7DSxT51O2",
            scope : "read",
            client_id : "my_client"
        };

        console.log($scope.grant_password);

        //authorization is encoded by client_id and secret
        $scope.encoded = btoa("my_client:secret");
        console.log("encoded client_id and secret : " + $scope.encoded);

        $http({
            method  : "POST",
            url     : "http://localhost:8087/oauth/token",
            // url     : "http://localhost:8087/oauth/authorize",
            headers : {
                //authorization is encoded by client_id and secret, not username and password.
                "authorization": "Basic bXlfY2xpZW50OnNlY3JldA==",
                // "Authorization": "Basic dHN0YXJrQGRycGx1cy5waDoxMjM0NTY=",
                //Spring oauth doesn't support json by default,
                // content-type must be application/x-www-form-urlencoded,
                // and the data have to be submit by form data format.
                "content-type":"application/x-www-form-urlencoded; charset=utf-8"
            },
            data    : $httpParamSerializer($scope.grant_password)
        }).then(function (success) {
            console.log(success);
            var access_token = success.data.access_token;
            console.log("access_token : " + access_token);

            if ($scope.rememberMe) {
                $cookies.putObject('refresh_token', success.data.refresh_token, {
                    expires : new Date(new Date().getTime() + 2592000000)
                });
            }

            $http({
                method : "GET",
                url : "http://localhost:8087/user/info",
                headers : {
                    //authorization is encoded by client_id and secret, not username and password.
                    "Authorization": "Bearer " + access_token,
                    "Accept":"application/json; charset=utf-8"
                }
            }).then(function (success) {
                console.log("user info :");
                console.log(success.data.principal);
                $scope.user = success.data.principal;
                if ($scope.rememberMe) {
                    $cookies.putObject('user', success.data.principal, {
                        expires : new Date(new Date().getTime() + 2592000000)
                    });
                }
                angular.element("#login-modal").modal('hide');
                loginSuccessfully();

            }, function (error) {
                // get error on finding user info
                console.log("failure =>");
                console.log(error);
            })

        }, function (error) {
            console.log("failure =>");
            console.log(error);
        })
    }

    //*** Separator ****** Separator ****** Separator ****** Separator ****** Separator ****** Separator ***//

    /**
     * sign up
     * @returns {boolean}
     */
    $scope.signup = function () {

        console.log("enter signup");

        if($scope.signupInputPassword != $scope.signupInputPasswordConfirm) {
            angular.element('#signupPassword').addClass('has-error');
            angular.element('#signupPasswordConfirm').addClass('has-error');
            $scope.password_error = "password not same"
            return false;
        }

        var birthday_timestamp = new Date($scope.signupBirthday).getTime()/1000;

        $scope.signupData = {
            username : $scope.signupInputEmail,
            password : $scope.signupInputPassword,
            enabled : 1,
            roles : "ROLE_USER",
            mobile : $scope.signupMobileNumber,
            firstname : $scope.signupFirstName,
            lastname : $scope.signupLastName,
            birthday : birthday_timestamp
        }

        console.log($scope.signupData);

        $http({
            method : "POST",
            url : "http://localhost:8087/signup",
            headers : {
                "content-type" : "application/json; charset=utf-8"
            },
            data : $scope.signupData
        }).then(function (success) {
            console.log("success =>");
            console.log(success);
        }, function (error) {
            console.log("failure =>");
            console.log(error);
        })

    }

    /**
     * log out
     */
    $scope.logout = function () {
        $cookies.remove('user');
        $scope.user = null;
        $cookies.remove('refresh_token');
        logoutSuccessfully();
    }
}]);



