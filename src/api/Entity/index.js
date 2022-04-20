import {DefaultAPIInstance} from "@/api"

export const EntityAPI = {
    entity: '',

    get(filters) {
        let url = ''
        if (filters) {
            url = `${this.entity}${filters}`
        } else {
            url = this.entity
        }
        return DefaultAPIInstance.get(url)
    },

    put (id, data) {
        const url = `${this.entity}/${id}`
        return DefaultAPIInstance.put(url, data)
    },

    post (data) {
        const url = `${this.entity}`
        return DefaultAPIInstance.post(url, data)
    },

    delete (id) {
        const url = `${this.entity}/${id}`
        return DefaultAPIInstance.delete(url)
    }
}

export const UserAPI = {
    url: 'users',

    create(data) {
        return DefaultAPIInstance.post(this.url, data)
    },

    get(filters) {
        if (filters)
            return DefaultAPIInstance.get(`${this.url}${filters}`)
        else
            return DefaultAPIInstance.get(this.url)
    },

    put (id, data) {
        return DefaultAPIInstance.put(`${this.url}/${id}`, data)
    },

    delete (id) {
        return DefaultAPIInstance.delete(`${this.url}/${id}`)
    },

    updateEmail(id, data) {
        return DefaultAPIInstance.put(`${this.url}/${id}/email`, data)
    },

    updatePassword(id, data) {
        return DefaultAPIInstance.put(`${this.url}/${id}/password`, data)
    },

    updateRole(id, data) {
        return DefaultAPIInstance.put(`${this.url}/${id}/role`, data)
    },

    updateActive(id, data) {
        return DefaultAPIInstance.put(`${this.url}/${id}/active?${data}`)
    },

    updateFull(id, data) {
        return DefaultAPIInstance.put(`${this.url}/${id}/full`, data)
    }
}