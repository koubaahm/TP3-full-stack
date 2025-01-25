import { MinimalShop } from './../types/shop';
import axios, { AxiosResponse } from 'axios';
import { Shop } from '../types';
import { ResponseArray } from '../types/response';

export function getShops(page: number, size: number): Promise<ResponseArray<Shop>> {
    return axios.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}`);
}

export function getShopsSorted(page: number, size: number, sort: string): Promise<ResponseArray<Shop>> {
    return axios.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}&sortBy=${sort}`);
}

export function getShopsFiltered(page: number, size: number, urlFilters: string): Promise<ResponseArray<Shop>> {
    return axios.get(`${process.env.REACT_APP_API}/shops?page=${page}&size=${size}${urlFilters}`);
}

export function getShop(id: string): Promise<AxiosResponse<Shop>> {
    return axios.get(`${process.env.REACT_APP_API}/shops/${id}`);
}

export function createShop(shop: MinimalShop): Promise<AxiosResponse<Shop>> {
    return axios.post(`${process.env.REACT_APP_API}/shops`, shop);
}

export function editShop(shop: MinimalShop): Promise<AxiosResponse<Shop>> {
    return axios.put(`${process.env.REACT_APP_API}/shops`, shop);
}

export function deleteShop(id: string): Promise<AxiosResponse<Shop>> {
    return axios.delete(`${process.env.REACT_APP_API}/shops/${id}`);
}

export function searchShops(
    name?: string, 
    page = 0, 
    size = 9, 
    inVacations?: boolean, 
    startDate?: string, 
    endDate?: string
): Promise<Shop[]> {
    const params = new URLSearchParams();
    
    if (name) params.append('name', name);
    if (inVacations !== undefined) params.append('inVacations', inVacations.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return axios
        .get(`${process.env.REACT_APP_API}/shops/search`, { params })
        .then(response => response.data);
}