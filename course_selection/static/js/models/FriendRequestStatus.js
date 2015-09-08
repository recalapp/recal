define(["require", "exports"], function (require, exports) {
    var FriendRequestStatus = (function () {
        function FriendRequestStatus() {
        }
        FriendRequestStatus.Accepted = "ACC";
        FriendRequestStatus.Pending = "PEN";
        FriendRequestStatus.Rejected = "REJ";
        return FriendRequestStatus;
    })();
    return FriendRequestStatus;
});
