(
  function () {
    angular
    .module("multiSigWeb")
    .controller("setLimitCtrl", function ($scope, $uibModalInstance, Utils, Transaction, wallet, Wallet) {
      $scope.address = wallet.address;

      Wallet
      .getLimit($scope.address, function (e, required) {
        $scope.limit = required.div('1e18').toNumber();
        $scope.$apply();
      }).call();

      $scope.setLimit = function () {
        Wallet.updateLimit($scope.address, new Web3().toBigNumber($scope.limit).mul('1e18'), function (e, tx){
          if (e) {
            Utils.dangerAlert(e);
          }
          else {
            $uibModalInstance.close();
            Utils.notification("Transaction sent, will be mined in next 20s");
            Transaction.add({txHash: tx, callback: function () {
              Utils.success("Required confirmations changed");
            }});
          }
        });
      };

      $scope.sign = function () {
        Wallet.signLimit($scope.address, new Web3().toBigNumber($scope.limit).mul('1e18'), function (e, tx) {
          if (e) {
            Utils.dangerAlert(e);
          }
          else {
            $uibModalInstance.close();
            Utils.signed(tx);
          }
        });
      };

      $scope.getNonce = function () {
        var data = Wallet.getUpdateLimitData($scope.address, new Web3().toBigNumber($scope.limit).mul('1e18'));
        Wallet.getNonce($scope.address, $scope.address, "0x0", data, function (e, nonce) {
          // Open modal
          $uibModalInstance.close();
          Utils.nonce(nonce);
        }).call();
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      }
    });
  }
)();
