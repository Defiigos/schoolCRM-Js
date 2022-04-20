<template>
  <div class="navbar-fixed">
    <nav class="orange lighten-1">
      <div class="container nav-wrapper">
        <a href="#" data-target="mobile-nav" class="sidenav-trigger"><i class="material-icons">menu</i></a>

        <ul class="left hide-on-med-and-down">
          <router-link to="/" custom  v-slot="{href, isExactActive}">
            <li :class="{'active': isExactActive }">
              <router-link :to="href">Главная</router-link>
            </li>
          </router-link>

          <router-link to="requests" custom  v-slot="{href, isActive}">
            <li :class="{'active': isActive }">
              <router-link :to="href">Заявки</router-link>
            </li>
          </router-link>
          
          <li :class="{'active': curentPath === 'students'}">
            <a 
                class="dropdown-trigger" 
                data-target="studentsDropdown" 
                ref="studentsDropdown"
            >
              Ученики
              <i class="material-icons right">expand_more</i>
            </a>
          </li>
        
          <router-link to="lessons" custom  v-slot="{href, isActive}">
            <li :class="{'active': isActive }">
              <router-link :to="href">Уроки</router-link>
            </li>
          </router-link>

          <router-link to="payments" custom  v-slot="{href, isActive}">
            <li :class="{'active': isActive }">
              <router-link :to="href">Платежи</router-link>
            </li>
          </router-link>

          <li :class="{hide: (role === 'user'), active: curentPath === 'admin'}">
            <a 
                class="dropdown-trigger" 
                data-target="adminDropdown" 
                ref="adminDropdown"
            >
              Администрирование
              <i class="material-icons right">expand_more</i>
            </a>
          </li>

        </ul>

        <ul class="right">
          <router-link to="profile" custom v-slot="{isActive}">
            <li :class="{'active' : isActive}">
              <a 
                  class="dropdown-trigger" 
                  data-target="userDropdown" 
                  ref="userDropdown"
              >
                {{$store.state.AuthModule.credentials.userName}}
                <i class="material-icons right">perm_identity</i>
              </a>
            </li>
          </router-link>
        </ul>
      </div> 
    </nav>

    <!-- Dropdowns elements -->
    <ul id="studentsDropdown" class="dropdown-content">
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="students"
        >
            Ученики
        </router-link>
      </li>
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="studentsGroups"
        >
            Группы учеников
        </router-link>
      </li>
    </ul>
    <ul id="adminDropdown" class="dropdown-content">
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="locations"
        >
            Адреса
        </router-link>
      </li>
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="lessonDurations"
        >
            Длительности
        </router-link>
      </li>
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="/paymentAmounts"
        >
            Стоимости
        </router-link>
      </li>
      <li v-if="role === 'super'">
        <router-link 
            class="orange-text text-lighten-1" 
            to="/users"
        >
            Пользователи
        </router-link>
      </li>
    </ul>
    <ul id="userDropdown" class="dropdown-content">
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="profile"
        >
            Профиль
        </router-link>
      </li>
      <li class="divider" tabindex="-1"></li>
      <li>
        <a 
            class="red-text text-lighten-1" 
            @click="logout"
        >
            Выход
        </a>
      </li>
    </ul>
  </div> 
  <!-- Mobile nav -->
  <div>
    <ul class="sidenav" id="mobile-nav" ref="mobileSidnav">
      <router-link to="/" custom  v-slot="{href, isExactActive}">
        <li :class="{'active': isExactActive }">
          <router-link 
              class="orange-text text-lighten-1" 
              :to="href"
          >
              Главная
          </router-link>
        </li>
      </router-link>

      <router-link to="requests" custom  v-slot="{href, isExactActive}">
        <li :class="{'active': isExactActive }">
          <router-link 
              class="orange-text text-lighten-1" 
              :to="href"
          >
              Заявки
          </router-link>
        </li>
      </router-link>

      <li class="no-padding">
        <ul class="collapsible collapsible-accordion">
          <li :class="{'active': curentPath === 'students'}">
            <a 
                class="dropdown-trigger orange-text text-lighten-1" 
                data-target="mobileStudentsDropdown" 
                ref="mobileStudentsDropdown"
            >
              Ученики
              <i class="material-icons right">expand_more</i>
            </a>
          </li>
        </ul>
      </li>

      <router-link to="lessons" custom  v-slot="{href, isActive}">
        <li :class="{'active': isActive }">
          <router-link 
              class="orange-text text-lighten-1" 
              :to="href"
          >
              Уроки
          </router-link>
        </li>
      </router-link>  

      <router-link to="payments" custom  v-slot="{href, isActive}">
        <li :class="{'active': isActive }">
          <router-link 
              class="orange-text text-lighten-1" 
              :to="href"
          >
              Платежи
          </router-link>
        </li>
      </router-link>

      <li class="no-padding">
        <ul class="collapsible collapsible-accordion">
          <li :class="{hide: role === 'user', active: curentPath === 'admin'}">
            <a 
                class="dropdown-trigger orange-text text-lighten-1" 
                data-target="mobileAdminDropdown" 
                ref="mobileAdminDropdown"
            >
              Администрирование
              <i class="material-icons right">expand_more</i>
            </a>
          </li>
        </ul>
      </li>
    </ul>
    
    <!-- Dropdowns elements -->
    <ul id="mobileStudentsDropdown" class="dropdown-content">
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="students"
        >
            Ученики
        </router-link>
      </li>
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="studentsGroups"
        >
            Группы учеников
        </router-link>
      </li>
    </ul>
    <ul id="mobileAdminDropdown" class="dropdown-content">
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="locations"
        >
            Адреса
        </router-link>
      </li>
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="lessonDurations"
        >
            Длительности
        </router-link>
      </li>
      <li>
        <router-link 
            class="orange-text text-lighten-1" 
            to="paymentAmounts"
        >
            Стоимости
        </router-link>
      </li>
      <li v-if="role === 'super'">
        <router-link 
            class="orange-text text-lighten-1" 
            to="users"
        >
            Пользователи
        </router-link>
      </li>
    </ul> 
  </div>
</template>

<script>
export default {
    name: "navbar",
    data:() => ({
      curentPath: '',
      sidenavInstance: {},
      role: 'user'
    }),
    methods: {
      checkRole() {
        if (localStorage.hasOwnProperty('userRoles'))
          if (localStorage.getItem('userRoles') === 'ROLE_ADMIN')
            return "admin"
          else if (localStorage.getItem('userRoles') === 'ROLE_SUPERADMIN')
              return "super"
        return "user"
      },

      logout() {
        this.$store.dispatch('AuthModule/onLogout').then(() => {          
          M.toast({html: 'Вы вышил из аккаунта', classes: 'green-text white'})
          this.$router.push('login')
        })
      }
    },
    mounted() {
      this.role = this.checkRole()

      M.Dropdown.init(this.$refs.studentsDropdown, {
        hover: true
      })
      M.Dropdown.init(this.$refs.adminDropdown, {
        hover: true
      })
      M.Dropdown.init(this.$refs.userDropdown, {})
      this.sidenavInstance = M.Sidenav.init(this.$refs.mobileSidnav, {
        draggable: true
      })
      M.Dropdown.init(this.$refs.mobileStudentsDropdown)
      M.Dropdown.init(this.$refs.mobileAdminDropdown)
    },
    watch: {
    $route(to) {
      this.curentPath = to.fullPath
      if (to.fullPath === '/students' || to.fullPath === '/studentsGroups')
        this.curentPath = 'students'

      if (to.fullPath === '/locations' || 
          to.fullPath === '/lessonDurations' || 
          to.fullPath === '/paymentAmounts' || 
          to.fullPath === '/users')
        this.curentPath = 'admin'

        this.sidenavInstance.close()
    }
    }
}
</script>