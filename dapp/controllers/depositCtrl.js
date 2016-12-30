(
  function () {
    angular
    .module("multiSigWeb")
    .controller("depositCtrl", function ($scope, Transaction, $routeParams, $uibModalInstance, Wallet, Utils, wallet) {
      $scope.wallet = wallet;
      $scope.amount = 10;
      $scope.deposit = function () {
        Transaction.send(
          {
            to: $scope.wallet.address,
            from: Wallet.coinbase,
            value: new EthJS.BN(new Web3().toWei($scope.amount)),
            nonce: Wallet.txParams.nonce
          },
          function (e, tx) {
            if (tx.blockNumber) {
              Utils.success("Deposit transaction was mined.");
            }
            else {
              Utils.notification("Deposit transaction was sent.");
              $uibModalInstance.close();
            }
          }
        );
      };

      $scope.sign = function () {
        Transaction.signOffline(
          {
            to: $scope.wallet.address,
            value: new EthJS.BN(new Web3().toWei($scope.amount))
          },
          function (e, signed) {
            if (e) {
              Utils.dangerAlert(e);
            }
            else {
              $uibModalInstance.close();
              Utils.signed(signed);
            }
          });
        };

        $scope.cancel = function () {
          $uibModalInstance.dismiss();
        };
    });
  }
)();
