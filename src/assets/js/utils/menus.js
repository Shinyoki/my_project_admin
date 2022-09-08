import router from "@/router";
import axios from "axios";
import {Notification} from "element-ui";

export function generateMenus() {
    axios.get("/api/admin/menus").then(res => {
        if (res.data.flag) {
           // ignored
        } else {
            Notification({
                type: 'error',
                message: res.data.message
            })
            router.push({path: "/login"})
        }
    })
}