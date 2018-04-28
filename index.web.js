import { Platform } from 'react-native';
import firebase from '@firebase/app';
import '@firebase/messaging'

export const FCMEvent = {
    RefreshToken: 'FCMTokenRefreshed',
    Notification: 'FCMNotificationReceived',
    DirectChannelConnectionChanged: 'FCMDirectChannelConnectionChanged'
};

export const RemoteNotificationResult = {
    NewData: 'UIBackgroundFetchResultNewData',
    NoData: 'UIBackgroundFetchResultNoData',
    ResultFailed: 'UIBackgroundFetchResultFailed'
};

export const WillPresentNotificationResult = {
    All: 'UNNotificationPresentationOptionAll',
    None: 'UNNotificationPresentationOptionNone'
};

export const NotificationType = {
    Remote: 'remote_notification',
    NotificationResponse: 'notification_response',
    WillPresent: 'will_present_notification',
    Local: 'local_notification'
};

export const NotificationCategoryOption = {
    CustomDismissAction: 'UNNotificationCategoryOptionCustomDismissAction',
    AllowInCarPlay: 'UNNotificationCategoryOptionAllowInCarPlay',
    PreviewsShowTitle: 'UNNotificationCategoryOptionHiddenPreviewsShowTitle',
    PreviewsShowSubtitle: 'UNNotificationCategoryOptionHiddenPreviewsShowSubtitle',
    None: 'UNNotificationCategoryOptionNone'
};

export const NotificationActionOption = {
    AuthenticationRequired: 'UNNotificationActionOptionAuthenticationRequired',
    Destructive: 'UNNotificationActionOptionDestructive',
    Foreground: 'UNNotificationActionOptionForeground',
    None: 'UNNotificationActionOptionNone',
};

export const NotificationActionType = {
    Default: 'UNNotificationActionTypeDefault',
    TextInput: 'UNNotificationActionTypeTextInput',
};

var config = {
    apiKey: "AIzaSyBBaf90a7Rk01aD3zUiZbnWfQf33q_IFvE",
    authDomain: "sunspot-edde9.firebaseapp.com",
    databaseURL: "https://sunspot-edde9.firebaseio.com",
    projectId: "sunspot-edde9",
    storageBucket: "",
    messagingSenderId: "9989641718"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
let canUserService = false;

const FCM = {};

FCM.getInitialNotification = () => {
    return Promise.resolve(true);
};

FCM.enableDirectChannel = () => {
    if (Platform.OS === 'ios') {
        return Promise.resolve(true);
    }
};

FCM.isDirectChannelEstablished = () => {
    return Platform.OS === 'ios' ? Promise.resolve(true) : Promise.resolve(true);
};

FCM.getFCMToken = (vapid) => {
    return new Promise((resolve, reject) => {
        messaging.usePublicVapidKey(vapid);
        messaging.getToken().then(token => {
            resolve(token);
        }).catch(reject);
    })
};

FCM.getEntityFCMToken = () => {
    return Promise.resolve(true);
}

FCM.deleteEntityFCMToken = () => {
    return Promise.resolve(true);
}

FCM.deleteInstanceId = () => {
    return Promise.resolve(true);
};

FCM.getAPNSToken = () => {
    if (Platform.OS === 'ios') {
        return Promise.resolve(true);
    }
};

FCM.requestPermissions = () => {
    let hasService = true;
    let hasPush = true;

    if (!('serviceWorker' in navigator)) {
        hasService = false;
    }

    if (!('PushManager' in window)) {
        hasPush = false;
    }

    if (hasService && hasPush) {
        canUserService = true;
        let registeredService = true;
        let gotPermission;

        return new Promise((resolve, reject) => {

            // navigator.serviceWorker.register('js/pushnotes.js').then(function (registration) {
            //     registeredService = registration;
            //     checkDone();
            // }).catch(function (err) {
            //     reject(err);
            // });

            return new Promise(function (res, rej) {
                const permissionResult = Notification.requestPermission(function (result) {
                    res(result);
                });

                if (permissionResult) {
                    permissionResult.then(res, rej);
                }
            }).then(function (permissionResult) {
                if (permissionResult !== 'granted') {
                    throw new Error('We weren\'t granted permission.');
                } else {
                    gotPermission = true;
                }
                checkDone();
            });

            function checkDone() {
                if (registeredService && gotPermission !== undefined) {
                    resolve({ registeredService, gotPermission });
                }
            }
        });
    } else {
        return Promise.reject(false);
    }
};

FCM.presentLocalNotification = (details) => {
    details.id = details.id || new Date().getTime().toString();
    details.local_notification = true;
    // RNFIRMessaging.presentLocalNotification(details);
};

FCM.scheduleLocalNotification = function (details) {
    if (!details.id) {
        throw new Error('id is required for scheduled notification');
    }
    details.local_notification = true;
    // RNFIRMessaging.scheduleLocalNotification(details);
};

FCM.getScheduledLocalNotifications = function () {
    return Promise.resolve(true);
};

FCM.cancelLocalNotification = (notificationID) => {
    if (!notificationID) {
        return;
    }
    // RNFIRMessaging.cancelLocalNotification(notificationID);
};

FCM.cancelAllLocalNotifications = () => {
    // RNFIRMessaging.cancelAllLocalNotifications();
};

FCM.removeDeliveredNotification = (notificationID) => {
    if (!notificationID) {
        return;
    }
    // RNFIRMessaging.removeDeliveredNotification(notificationID);
};

FCM.removeAllDeliveredNotifications = () => {
    // RNFIRMessaging.removeAllDeliveredNotifications();
};

FCM.setBadgeNumber = (number) => {
    // RNFIRMessaging.setBadgeNumber(number);
};

FCM.getBadgeNumber = () => {
    return Promise.resolve(true);
};

function finish(result) {
    if (Platform.OS !== 'ios') {
        return;
    }
    if (!this._finishCalled && this._completionHandlerId) {
        this._finishCalled = true;
        switch (this._notificationType) {
            case NotificationType.Remote:
                result = result || RemoteNotificationResult.NoData;
                if (!Object.values(RemoteNotificationResult).includes(result)) {
                    throw new Error(`Invalid RemoteNotificationResult, use import {RemoteNotificationResult} from 'react-native-fcm' to avoid typo`);
                }
                // RNFIRMessaging.finishRemoteNotification(this._completionHandlerId, result);
                return;
            case NotificationType.NotificationResponse:
                // RNFIRMessaging.finishNotificationResponse(this._completionHandlerId);
                return;
            case NotificationType.WillPresent:
                result = result || (this.show_in_foreground ? WillPresentNotificationResult.All : WillPresentNotificationResult.None);
                if (!Object.values(WillPresentNotificationResult).includes(result)) {
                    throw new Error(`Invalid WillPresentNotificationResult, make sure you use import {WillPresentNotificationResult} from 'react-native-fcm' to avoid typo`);
                }
                // RNFIRMessaging.finishWillPresentNotification(this._completionHandlerId, result);
                return;
            default:
                return;
        }
    }
}

FCM.on = (event, callback) => {
    if (!Object.values(FCMEvent).includes(event)) {
        throw new Error(`Invalid FCM event subscription, use import {FCMEvent} from 'react-native-fcm' to avoid typo`);
    };

    if (event === FCMEvent.Notification) {
        // return EventEmitter.addListener(event, async (data) => {
        //     data.finish = finish;
        //     try {
        //         await callback(data);
        //     } catch (err) {
        //         console.error('Notification handler err:\n' + err.stack);
        //         throw err;
        //     }
        //     if (!data._finishCalled) {
        //         data.finish();
        //     }
        // });

        messaging.onMessage(sendMessageCallback);

        // navigator.serviceWorker.addEventListener('message', (event) => {
        //     // let payload = JSON.parse(event.data || '{}');
        //     if(event)
        //     sendMessageCallback(event);
        // })

        function sendMessageCallback(payload) {
            if (event === FCMEvent.Notification) {
                let data = payload.data || {};
                delete payload.data;
                try {
                    if (data.notification) {
                        data.notification = JSON.parse(data.notification);
                    }
                } catch (err) { }
                const pay = Object.assign(data, payload);
                callback(pay);
            }
        }
    }
    // return EventEmitter.addListener(event, callback);
};

FCM.subscribeToTopic = (topic) => {
    // RNFIRMessaging.subscribeToTopic(topic);
};

FCM.unsubscribeFromTopic = (topic) => {
    // RNFIRMessaging.unsubscribeFromTopic(topic);
};

FCM.send = (senderId, payload) => {
    // RNFIRMessaging.send(senderId, payload);
};

FCM.setNotificationCategories = (categories) => {
    if (Platform.OS === 'ios') {
        // RNFIRMessaging.setNotificationCategories(categories);
    }
}

export default FCM;

export { };
