import axios from "axios";

import { MENU_API_URL } from "../constants/APIConstant.js";

export async function addMenu(menu) {
    return axios.post(MENU_API_URL, menu);
}

export async function getAllMenus() {
    return await axios.get(MENU_API_URL);
}

export function getMenuByRestaurantId(restaurantId) {
    return axios.get(`${MENU_API_URL}/${restaurantId}`);
}

export function deleteMune(menuId) {
    return axios.delete(`${MENU_API_URL}/${menuId}`);
}

export function updateMenu(menuId, menuData) {
    return axios.put(`${MENU_API_URL}/${menuId}`, menuData);
}