export const usersCreateFields = [
    {
        id: 'createUserName',
        title: "Имя",
        type: "text",
        target: "username"
    },
    {
        id: 'createUserEmail',
        title: "Email",
        type: "email",
        target:"email"
    },
    {
        id: 'createUserPass',
        title: "Пароль",
        type: "password",
        target:"password"
    },
    {
        id: 'createUserRoles',
        title: "Роль",
        type: "text",
        target:"roles"
    }
]

export const usersUpdateFields = [
    {
        id: 'updateUserName',
        title: "Имя",
        type: "text",
        target: "username"
    },
    {
        id: 'updateUserEmail',
        title: "Email",
        type: "email",
        target:"email"
    },
    {
        id: 'updateUserPass',
        title: "Пароль",
        type: "password",
        target:"password"
    },
    {
        id: 'updateUserRoles',
        title: "Роль",
        type: "text",
        target:"roles"
    },
    {
        id: 'updateUserActive',
        title: "Статус",
        type: "text",
        target:"active"
    }
]

export const locationCreateFields = [
    {
        id: 'createLocationAddress',
        title: "Адрес",
        type: "text",
        target: "address"
    },
    {
        id: 'createLocationName',
        title: "Имя",
        type: "text",
        target:"name"
    }
]

export const locationUpdateFields = [
    {
        id: 'updateLocationAddress',
        title: "Адрес",
        type: "text",
        target: "address"
    },
    {
        id: 'updateLocationName',
        title: "Имя",
        type: "text",
        target:"name"
    },
    {
        id: 'updateLocationStatus',
        title: "Статус",
        type: "text",
        target:"status"
    }
]

export const lessonDurationsCreateFields = [
    {
        id: 'createLessonDurationsTime',
        title: "Длительность",
        type: "time",
        target: "time"
    },
    {
        id: 'createLessonDurationsName',
        title: "Имя",
        type: "text",
        target:"name"
    }
]

export const lessonDurationsUpdateFields = [
    {
        id: 'updateLessonDurationsTime',
        title: "Длительность",
        type: "time",
        target: "time"
    },
    {
        id: 'updateLessonDurationsName',
        title: "Имя",
        type: "text",
        target:"name"
    }
]

export const paymentAmountsCreateFields = [
    {
        id: 'createPaymentAmountsSum',
        title: "Стоимость",
        type: "number",
        target: "sum"
    },
    {
        id: 'createPaymentAmountsName',
        title: "Имя",
        type: "text",
        target:"name"
    }
]

export const paymentAmountsUpdateFields = [
    {
        id: 'updatePaymentAmountsSum',
        title: "Стоимость",
        type: "number",
        target: "sum"
    },
    {
        id: 'updatePaymentAmountsName',
        title: "Имя",
        type: "text",
        target:"name"
    }
]

export const paymentsUpdateFields = [
    // {
    //     id: 'updatePaymentSum',
    //     title: "Стоимость",
    //     type: "text",
    //     target:"amountDto"
    // },
    {
        id: 'updatePaymentStatus',
        title: "Статус",
        type: "text",
        target: "status"
    }
    
]

export const studentsCreateFields = [
    {
        id: 'createName',
        title: "Имя",
        type: "text",
        target: "name"
    },
    {
        id: 'createPhone',
        title: "Телефон",
        type: "text",
        target: "phone"
    },
    {
        id: 'createParentName',
        title: "Родитель",
        type: "text",
        target: "parentName"
    },
    {
        id: 'createParentPhone',
        title: "Телефон родителя",
        type: "text",
        target: "parentPhone"
    },
    {
        id: 'createDescription',
        title: "Описание",
        type: "text",
        target: "description"
    }
]

export const studentsUpdateFields = [
    {
        id: 'updateName',
        title: "Имя",
        type: "text",
        target: "name"
    },
    {
        id: 'updatePhone',
        title: "Телефон",
        type: "text",
        target: "phone"
    },
    {
        id: 'updateParentName',
        title: "Родитель",
        type: "text",
        target: "parentName"
    },
    {
        id: 'updateParentPhone',
        title: "Телефон родителя",
        type: "text",
        target: "parentPhone"
    },
    {
        id: 'updateDescription',
        title: "Описание",
        type: "text",
        target: "description"
    },
    {
        id: 'updateStatus',
        title: "Статус",
        type: "text",
        target: "status"
    } 
]

export const lessonsGroupsCreateFields = [
    {
        id: 'createName',
        title: "Имя",
        type: "text",
        target: "name"
    },
    {
        id: 'createStudents',
        title: "Ученики",
        type: "text",
        target: "students"
    }
]

export const lessonsGroupsUpdateFields = [
    {
        id: 'updateName',
        title: "Имя",
        type: "text",
        target: "name"
    },
    {
        id: 'updateStatus',
        title: "Статус",
        type: "text",
        target: "status"
    }
]

export const lessonsAdminCreateFields = [
    {
        id: 'createTeacher',
        title: "Учитель",
        type: "text",
        target: "teacher"
    },
    {
        id: 'createDate',
        title: "Дата",
        type: "date",
        target: "date"
    },
    {
        id: 'createTime',
        title: "Время",
        type: "time",
        target: "time"
    },
    {
        id: 'createDuration',
        title: "Длительность",
        type: "text",
        target: "lessonDuration"
    },
    {
        id: 'createLocation',
        title: "Адрес",
        type: "text",
        target: "location"
    },
    {
        id: 'createGroups',
        title: "Группа студентов",
        type: "text",
        target: "lessonGroup"
    },
    {
        id: 'createAmount',
        title: "Стоимость",
        type: "text",
        target: "paymentAmount"
    }
]

export const lessonsUserCreateFields = [
    {
        id: 'createDate',
        title: "Дата",
        type: "date",
        target: "date"
    },
    {
        id: 'createTime',
        title: "Время",
        type: "time",
        target: "time"
    },
    {
        id: 'createDuration',
        title: "Длительность",
        type: "text",
        target: "lessonDuration"
    },
    {
        id: 'createLocation',
        title: "Адрес",
        type: "text",
        target: "location"
    },
    {
        id: 'createGroups',
        title: "Группа студентов",
        type: "text",
        target: "lessonGroup"
    },
    {
        id: 'createAmount',
        title: "Стоимость",
        type: "text",
        target: "paymentAmount"
    }
]

export const lessonsAdminUpdateFields = [
    {
        id: 'updateTeacher',
        title: "Учитель",
        type: "text",
        target: "teacher"
    },
    {
        id: 'updateDate',
        title: "Дата",
        type: "date",
        target: "date"
    },
    {
        id: 'updateTime',
        title: "Время",
        type: "time",
        target: "time"
    },
    {
        id: 'updateDuration',
        title: "Длительность",
        type: "text",
        target: "lessonDuration"
    },
    {
        id: 'updateLocation',
        title: "Адрес",
        type: "text",
        target: "location"
    },
    // {
    //     id: 'updateGroups',
    //     title: "Группа студентов",
    //     type: "text",
    //     target: "lessonGroup"
    // },
    {
        id: 'updateStatus',
        title: "Статус",
        type: "text",
        target: "status"
    }
]

export const lessonsUserUpdateFields = [
    {
        id: 'updateDate',
        title: "Дата",
        type: "date",
        target: "date"
    },
    {
        id: 'updateTime',
        title: "Время",
        type: "time",
        target: "time"
    },
    {
        id: 'updateDuration',
        title: "Длительность",
        type: "text",
        target: "lessonDuration"
    },
    {
        id: 'updateLocation',
        title: "Адрес",
        type: "text",
        target: "location"
    },
    // {
    //     id: 'updateGroups',
    //     title: "Группа студентов",
    //     type: "text",
    //     target: "lessonGroup"
    // },
    {
        id: 'updateStatus',
        title: "Статус",
        type: "text",
        target: "status"
    }
]

export const lessonsHomeUpdateFields = [
    {
        id: 'updateDate',
        title: "Дата",
        type: "date",
        target: "date"
    },
    {
        id: 'updateTime',
        title: "Время",
        type: "time",
        target: "time"
    },
    {
        id: 'updateDuration',
        title: "Длительность",
        type: "text",
        target: "lessonDuration"
    },
    {
        id: 'updateLocation',
        title: "Адрес",
        type: "text",
        target: "location"
    },
    // {
    //     id: 'updateGroups',
    //     title: "Группа студентов",
    //     type: "text",
    //     target: "lessonGroup"
    // },
    {
        id: 'updateStatus',
        title: "Статус",
        type: "text",
        target: "status"
    }
]