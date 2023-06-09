## Запросы к серверу

Adress - http://localhost:5000/

В случае успешного запроса возвращается объект json вида
```javascript
{ status: 'success', body: String | Object }
```
В случае ошибки возвращается объект json вида 
```javascript
{ status: 'error', message: '' }
```

### Аутентификация
**Обязательные поля:** имя (username), email (email)(запретить изменение в дальнейшем), password (password)
**По умолчанию также создаются поля:** avatar, posts

Метод | URL | Действие | Комментарий
--- | --- | ---  | ---
`POST` | `/auth/registration` | регистрация пользователя | в случае успеха в поле body возвращается созданный объект user
`POST` | `/auth/login` | авторизация пользователя | в случае успеха в поле body возвращается созданный токен

### Работа с постами
**НЕ Обязательные поля:** заголовок (title)  
**Обязательные поля:** описание (description)
**По умолчанию также создаются поля:** username, userID

Для запросов post, put, delete необходимо передать headers со значением 
```javascript
{ 'Authorization': 'Bearer token' }
```


Метод | URL | Действие | Комментарий
--- | --- | ---  | ---
`GET` | `/` | получить все посты | в случае успеха в поле body возвращается объект posts
`GET` | `/:id` | получить пост по ID | в случае успеха в поле body возвращается объект post
`POST` | `/create` | создать пост | в случае успеха в поле body возвращается созданный объект post
`PUT` | `/:id` | редактировать пост по **ID** | в случае успеха в поле body возвращается отредактированный объект post
`DELETE` | `/:id` | удалить пост по **ID** | в случае успеха в поле body возвращается строка 'Успешно удалено'