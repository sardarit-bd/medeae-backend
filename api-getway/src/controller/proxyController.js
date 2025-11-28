import forward from "../utils/httpProxy.js";

const proxyController = {
    auth: forward("AUTH"),
    profile: forward("PROFILE"),
    // payment: forward("PAYMENT"),
    // notification: forward("NOTIFICATION"),
    // chat: forward("CHAT"),
    // ai: forward("AI"),
    // file: forward("FILE"),
};



export default proxyController;