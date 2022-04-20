<template>
    <div class="container">
        <div class="section center">
            <h3>Профиль пользователя</h3>
        </div>
        <div class="divider"></div>
        <div class="section">
            <div class="row">
                <orange-input 
                    class="col l4 offset-l4 m6 offset-m3 s10 offset-s1" 
                    id="name"
                    title="Имя"
                    v-model="v$.username.$model"
                    :validate="v$.username.$dirty"
                    :valid="v$.username.required.$response"
                />
            </div>
            <div class="row">
                <div class="center">
                    <h6>Роль: {{role}}</h6>
                </div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="section">
            <div class="center">
                <h5>Смена Email</h5>
            </div>
            <div class="row">
                <orange-input 
                    class="col l4 offset-l4 m6 offset-m3 s10 offset-s1" 
                    id="email"
                    type="email"
                    title="Email"
                    v-model="v$.email.$model"
                    :validate="v$.email.$dirty"
                    :valid="
                        (v$.email.required.$response && 
                         v$.email.email.$response)"
                    validText="Email верен"
                    invalidText="Email не верен"
                />
            </div>
            <div class="row">
                <orange-input 
                    class="col l4 offset-l4 m6 offset-m3 s10 offset-s1" 
                    id="emailPass"
                    type="password"
                    title="Пароль"
                    v-model="v$.emailPass.$model"
                    :validate="v$.emailPass.$dirty"
                    :valid="v$.emailPass.required.$response"
                />
            </div>
            <div class="row">
                <div v-if="incorectChangeEmailPass" class="center-align">
                    <span class="red-text" >Не верный Пароль</span>
                </div>
                <div v-if="incorectChangeEmail" class="center-align">
                    <span class="red-text" >Этот Email уже занят</span>
                </div>
            </div>
            <div class="row">
                <div class="col l4 offset-l4 m6 offset-m3 s10 offset-s1 center">
                    <flat-orange-button 
                        @click="changeEmail"
                        :class="{disabled: !((v$.email.required.$response && 
                                          v$.email.email.$response) && 
                                          v$.emailPass.required.$response)}"
                    >
                        Сменить
                    </flat-orange-button>
                </div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="section">
            <div class="center">
                <h5>Смена пароля</h5>
            </div>
            <div class="row">
                <orange-input 
                    class="col l4 offset-l4 m6 offset-m3 s10 offset-s1" 
                    id="oldPass"
                    type="password"
                    title="Старый пароль"
                    v-model="v$.oldPass.$model"
                    :validate="v$.oldPass.$dirty"
                    :valid="v$.oldPass.required.$response"
                />
            </div>
            <div class="row">
                <orange-input 
                    class="col l4 offset-l4 m6 offset-m3 s10 offset-s1" 
                    id="newPass"
                    type="password"
                    title="Новый пароль"
                    v-model="v$.newPass.$model"
                    :validate="v$.newPass.$dirty"
                    :valid="
                        (v$.newPass.required.$response && 
                         v$.newPass.minLength.$response)"
                    validText="Пароль подходит"
                    invalidText="Пароль должен быть не менее 6 символов"
                />
            </div>
            <div class="row">
                <div v-if="incorectChangePass" class="center-align">
                    <span class="red-text" >Старый Пароль не верен</span>
                </div>
            </div>
            <div class="row">
                <div class="col l4 offset-l4 m6 offset-m3 s10 offset-s1 center">
                    <flat-orange-button
                        @click="changePass"
                        :class="{disabled: !(v$.oldPass.required.$response && 
                                            (v$.newPass.required.$response && 
                                            v$.newPass.minLength.$response))}"
                    >
                        Сменить
                    </flat-orange-button>
                </div>
            </div>
        </div>
        <div class="divider"></div>

        <div class="section">
            <div class="row">
                <div class="col l4 offset-l4 m8 offset-m2 s8 offset-s2 center">
                    <flat-orange-button 
                        icon="edit" 
                        @click="updateUser"
                        :class="{disabled: !v$.username.required.$response}"
                    >
                        Сохранить
                    </flat-orange-button>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import FlatOrangeButton from '@/components/Ui/FlatOrangeButton.vue'
import OrangeInput from '@/components/Ui/OrangeInput.vue'

import useVuelidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'

import {usersRoles} from '@/assets/statuses'
import {UserAPI} from '@/api/Entity'

export default {
    components: { FlatOrangeButton, OrangeInput },
    name: "ProfileView",
    setup () {
        return { v$: useVuelidate() }
    },
    data:() => ({
        username: "",
        role: "",
        email: "",
        emailPass: "",
        oldPass: "",
        newPass: "",
        incorectChangeEmail: false,
        incorectChangeEmailPass: false,
        incorectChangePass: false
    }),
    validations () {
        return {
            username: {required},
            email: { required, email },
            emailPass: { required },
            oldPass: { required },
            newPass: { required, minLength: minLength(6) }
        }
    },
    methods: {
        setData() {
            usersRoles.forEach((role) => {
                if (role.type === this.$store.state.AuthModule.credentials.userRoles)
                    this.role = role.title
            })
            this.username = this.$store.state.AuthModule.credentials.userName
            this.email = this.$store.state.AuthModule.credentials.userEmail  
        },
        changeEmail() {
            UserAPI.updateEmail(
                this.$store.state.AuthModule.credentials.userId, 
                { newEmail: this.email, password: this.emailPass }
                ).then((res) => {
                    M.toast({
                        html: "Email успешно измененн! <br> Пожалуйста перезайдете в учетную запись", 
                        classes: 'green-text white', 
                        options: {displayLength: 1000}
                        })
                }).catch((e) => {
                    M.toast({
                        html: 'Ошибка! ' + e.response.data.message, 
                        classes: 'red-text white', 
                        options: {displayLength: 10000}
                        })
            })
        },
        changePass() {
            UserAPI.updatePassword(
                this.$store.state.AuthModule.credentials.userId, 
                { oldPassword: this.oldPass, newPassword: this.newPass }
                ).then((res) => {
                    M.toast({
                        html: "Пароль успешно измененн!", 
                        classes: 'green-text white', 
                        options: {displayLength: 1000}
                        })
                }).catch((e) => {
                    M.toast({
                        html: 'Ошибка! ' + e.response.data.message, 
                        classes: 'red-text white', 
                        options: {displayLength: 10000}
                        })
            })
        },
        updateUser() {
            UserAPI.put(
                this.$store.state.AuthModule.credentials.userId, 
                { username: this.username }
                ).then((res) => {
                    this.$store.commit('AuthModule/setUserName', this.username)
                    M.toast({
                        html: "Данные пользователя успешно измененны!", 
                        classes: 'green-text white', 
                        options: {displayLength: 1000}
                        })
                }).catch((e) => {
                    M.toast({
                        html: 'Ошибка! ' + e.response.data.message, 
                        classes: 'red-text white', 
                        options: {displayLength: 10000}
                        })
            })
        }
    },
    mounted() {
        this.setData()
    }
}
</script>