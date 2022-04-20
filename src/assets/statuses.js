export const usersRoles = [
    {
        title: 'Учитель',
        type: 'ROLE_USER',
        style: 'green-text'
    },
    {
        title: 'Администратор',
        type: 'ROLE_ADMIN',
        style: 'amber-text'
    },
    {
        title: 'Суперадмин',
        type: 'ROLE_SUPERADMIN',
        style: 'red-text'
    }
]

export const usersActive = [
    {
        title: 'Активен',
        type: 'true',
        style: 'green-text'
    },
    {
        title: 'Заблокирован',
        type: 'false',
        style: 'red-text'
    }
]

export const requestStatuses = [
    {
        title: 'Новая',
        type: 'REQUEST_NEW',
        style: 'blue-text'
    },
    {
        title: 'Заблокированная',
        type: 'REQUEST_BLOCKED',
        style: 'red-text text-lighten-1'
    },
    {
        title: 'Обработанная',
        type: 'REQUEST_FINISHED',
        style: 'green-text'
    },
    {
        title: 'Отмененная',
        type: 'REQUEST_CANCELED',
        style: 'amber-text'
    }
]

export const lessonsGroupsStatuses = [
    {
        title: 'Активна',
        type: 'LESSON_GROUP_ACTIVE',
        style: 'green-text'
    },
    {
        title: 'Неактивна',
        type: 'LESSON_GROUP_INACTIVE',
        style: 'red-text'
    }
]

export const lessonsStatuses = [
    {
        title: 'Предстояший',
        type: 'LESSON_COMING',
        style: 'blue-text'
    },
    {
        title: 'Прошедший',
        type: 'LESSON_PAST',
        style: 'green-text'
    },
    {
        title: 'Отмененный',
        type: 'LESSON_CANCELED',
        style: 'red-text'
    }
]

export const locationsStatuses = [
    {
        title: 'Активный',
        type: 'LOCATION_ACTIVE',
        style: 'green-text'
    },
    {
        title: 'Неактивный',
        type: 'LOCATION_INACTIVE',
        style: 'red-text'
    }
]

export const paymentsStatuses = [
    {
        title: 'Оплачен',
        type: 'PAYMENT_PAID',
        style: 'green-text'
    },
    {
        title: 'Неоплачен',
        type: 'PAYMENT_UNPAID',
        style: 'blue-text'
    },
    {
        title: 'Отменен',
        type: 'PAYMENT_CANCELED',
        style: 'red-text'
    },
    {
        title: 'Возврат',
        type: 'PAYMENT_REMOVED',
        style: 'amber-text'
    }
]

export const studentsStatuses = [
    {
        title: 'Активен',
        type: 'STUDENT_ACTIVE',
        style: 'green-text'
    },
    {
        title: 'Неактивен',
        type: 'STUDENT_INACTIVE',
        style: 'red-text'
    }
]