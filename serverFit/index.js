const {MongoClient, ObjectId} = require("mongodb");
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
const port = 3000
const uri =
    "mongodb://address:port/";
const client = new MongoClient(uri);
let db;
let users;
let dishes;
let workouts;
let workouts_plans;
let users_dishes;
client.connect().then(async r => {
    db = client.db("fit_app");
    users = db.collection("users");
    dishes = db.collection("dishes");
    workouts = db.collection("workouts");
    workouts_plans = db.collection("workouts_plans");
    users_dishes = db.collection("users_dishes");
    /*workouts.insertOne({
        plan_id:ObjectId("624cb061c608aba01999c0bd"),
        level:"easy",
        day:"pn",
        name:"Трицеп, грудь",
        exercises:[
            "Отжимания 30х5",
            "Гантели 15х5"
        ]
    })
    workouts.insertOne({
        plan_id:ObjectId("624cb061c608aba01999c0bd"),
        level:"medium",
        day:"pn",
        name:"Трицеп, грудь",
        exercises:[
            "Отжимания 50х5",
            "Гантели 25х5"
        ]
    })
    workouts.insertOne({
        plan_id:ObjectId("624cb061c608aba01999c0bd"),
        level:"hard",
        day:"pn",
        name:"Трицеп, грудь",
        exercises:[
            "Отжимания 70х5",
            "Гантели 55х5"
        ]
    })*/
    /*    dishes.insertOne({
            name:"Макароны, тушенные в сковороде",
            for_what: "Ужин",
            reception:{
                products:"Макароны (рожки, перья и т.п.) – 200 г<br/>" +
                    "Помидор крупный – 1 шт.<br/>" +
                    "Лук репчатый – 1 шт.<br/>" +
                    "Чеснок – 3 зубка<br/>" +
                    "Специи – по вкусу<br/>" +
                    "Соль – по вкусу<br/>" +
                    "Масло растительное – 40 мл<br/>" +
                    "Вода – 250 мл<br/>" +
                    "Зелень свежая (для подачи) - 2-3 веточки<br/>",
                text:"Подготавливаем нужные ингредиенты. Также берем вместительную глубокую сковороду.\n" +
                    "Репчатый лук и чесночные зубчики очищаем, помидоры и свежую зелень промываем и обсушиваем.\n" +
                    "Лук мелко шинкуем. Отправляем луковую нарезку в разогретое растительное масло.\n" +
                    "Мелкими кубиками нарезаем помидор (при желании можно предварительно снять кожицу с помидора, опустив его в кипяток на пару минут). Измельчаем чеснок.\n" +
                    "Добавляем чеснок и помидор на сковороду к луку. Обжариваем овощи, периодически перемешивая.\n" +
                    "К обжаренным овощам всыпаем макаронные изделия.\n" +
                    "Макароны с помидорами, луком и чесноком перемешиваем, приправляем по вкусу солью и любимыми специями.\n" +
                    "Кипятим воду и заливаем водой макароны с овощами.\n" +
                    "Тушим макароны в сковороде, под крышкой, до готовности. Если вода выкипела, а макароны еще не готовы, то подливаем еще немного горячей кипяченой воды.\n" +
                    "Готовое блюдо из макарон с овощами при подаче присыпаем нарезанной свежей зеленью.\n" +
                    "Приятного аппетита!"
            },
            kkall:700,
            photo:"https://img1.russianfood.com/dycontent/images_upl/179/big_178809.jpg"
        })
        dishes.insertOne({
            name:"Варенные яйца",
            for_what: "Полдник",
            reception:{
                products:"Куриное яйцо 3шт.",
                text:"Отварите куринное яйцо"
            },
            kkall:300,
            photo:"https://www.kleo.ru/img/articles/141700_ChrisSexton_60cc84ca-2b89-42b6-9851-11b08df169e4.png"
        })
        dishes.insertOne({
            name:"Творог",
            for_what: "Завтрак",
            reception:{
                products:"Творог 18% 300 г.",
                text:"Творог отлично подходит для перекуса или как продукт на утро"
            },
            kkall:236,
            photo:"https://goodfood.ua/wp-content/uploads/2020/07/tvorog.jpg"
        })
        dishes.insertOne({
            name:"Мясо куринное",
            for_what: "Ужин",
            reception:{
                products:"Куринное филе 300г.",
                text:"Отварите филе курицы."
            },
            kkall:1000,
            photo:"https://yummybook.ru/upload/files/images/podborki/poultry.jpg"
        })
        dishes.insertOne({
            name:"Гречка",
            for_what: "Завтрак",
            reception:{
                products:"Гречка 500г",
                text:"Очень много гречки, отлично подходит для поддержания и набора массы, просто отврите её"
            },
            kkall:1200,
            photo:"https://www.photorecept.ru/wp-content/uploads/2020/02/8b445902-79a9-4030-ad1f-f76f1119b3f6-1300x1084.jpeg"
        })*/
}).catch((e) => console.error(e));

app.get('/', async (req, res) => {
    res.end("idi naxyu")
})
app.post('/api', bodyParser.json({limit: '1000mb'}), async (req, res) => {
    let t_ = req.body.t_;
    let level;
    let works
    let user;
    let result = {result: false}
    let id
    switch (t_) {
        case "initUser":
            id = req.body.user.id;
            user = await users.findOne({_id: id});
            if (!user) {
                user = req.body.user;
                user._id = user.id;
                delete user.id;
                users.insertOne(user)
            }
            return res.end(JSON.stringify(user))
        //Получить продукты на определенный день
        case "getProducts":
            result.result = true;
            //Сколько максимум ккалл нужно
            let kkall = req.body.kkall
            //Какой день - pn,vt,sr...
            let dday = req.body.day;
            // Тип диеты, похудение 1, набор -1, поддержние 0
            let type_of = req.body.type;
            //Айди вк человека
            id = req.body.id;
            //Ищем в базе уже готовый рацион наа этот день и на эти каллории
            let user_day = await users_dishes.findOne({user_id: id, day: dday, kkall})
            //Если нет, то составляем новый рацион
            if (!user_day) {
                //Получаем Все блюдаа в базе
                let all_dishes = await dishes.find().toArray()
                //Конечно же если они есть
                if (all_dishes) {
                    //Получаем завтраки
                    let breakfastak = all_dishes.filter(x => x.for_what === "Завтрак")
                    //Получаем обеды
                    let dinner = all_dishes.filter(x => x.for_what === "Обед")
                    // Получаем полдник
                    let afternoon = all_dishes.filter(x => x.for_what === "Полдник")
                    //Получаем ужин
                    let evening = all_dishes.filter(x => x.for_what === "Ужин")

                    //Теперь ищем все его рационы на данную ккаллорию
                    let all_days = await users_dishes.find({user_id: id, kkall}).toArray()
                    //И перебираем их если они есть
                    if (all_days && all_days.length > 0) {
                        //Это просто нужно чтобы сделать общий массив из всех блюд
                        all_days = all_days.map(item => {
                            return item.dishes;
                        })
                        let a1 = []
                        all_days.map(x => x.map(x1 => {
                            a1.push(x1)
                        }))
                        //Это просто нужно чтобы сделать общий массив из всех блюд

                        //Теперь у нас есть массив всех его блюд по днной ккаллории, перебирем
                        a1.map((item, key) => {
                            //Выше мы отсортировали все блюдаа по звтракам, обедам и по ужинам
                            //Ищем в этих отсортированных обедах item(блюдо которое уже есть в рационе у человека)
                            //Это нужно чтобы на всю неделю дать ему разные блюда, а не одно и тоже
                            let found1 = breakfastak.find(x => String(x._id) === String(item._id))
                            let found2 = dinner.find(x => String(x._id) === String(item._id))
                            let found3 = afternoon.find(x => String(x._id) === String(item._id))
                            let found4 = evening.find(x => String(x._id) === String(item._id))
                            //Разумеется если мы нашли что-то, то просто убираем его из массива заавтраков и т.д
                            if (found1) {
                                breakfastak.splice(breakfastak.indexOf(found1), 1)
                            }
                            if (found2) {
                                dinner.splice(dinner.indexOf(found2), 1)
                            }
                            if (found3) {
                                afternoon.splice(afternoon.indexOf(found3), 1)
                            }
                            if (found4) {
                                evening.splice(evening.indexOf(found4), 1)
                            }
                        })
                    }
                    //Теперь мы проверяем какой тип человек выбрал - похудение, поддержние или набор
                    // (похудение 1, набор -1, поддержние 0)
                    let result_dishes = [];
                    let percent = 0;
                    //И сортируем массивы по нужной нам опции
                    if (type_of === 1) {
                        //Если похудение, то естественно нам надо отсортироваать по возрастанию ККАЛЛ наших блюд
                        //Чтобы снизу были малоккалорийные блюда, чтобы проще было составить рацион
                        breakfastak.sort((a, b) => {
                            return a.kkall - b.kkall
                        })
                        dinner.sort((a, b) => {
                            return a.kkall - b.kkall
                        })
                        evening.sort((a, b) => {
                            return a.kkall - b.kkall
                        })
                    } else if (type_of === -1) {
                        //Ну и набор разумеется в обратную сторону - от болшего ККАЛЛ к меньшему
                        percent = 500;
                        breakfastak.sort((a, b) => {
                            return b.kkall - a.kkall
                        })
                        dinner.sort((a, b) => {
                            return b.kkall - a.kkall
                        })
                        evening.sort((a, b) => {
                            return b.kkall - a.kkall
                        })
                    } else {
                        //Если же просто надо поддержать, я перемешиваю массив, просто чтобы попались рандомные блюда
                        percent = 300;
                        shuffle(breakfastak);
                        shuffle(dinner);
                        shuffle(afternoon);
                        shuffle(evening);
                    }
                    //Тут мы просто проверяем, вдруг в массиве завтраков после проверок не осталось блюд, то - пропуск
                    if(breakfastak.length > 0)
                        result_dishes.push(breakfastak[0]);
                    else
                        result_dishes.push({
                            name: "Пропустить",
                            kkall: 0
                        })
                    //Перебираем массив с обедами
                    for (let i = 0; i < dinner.length; i++) {
                        //Если блюдо нам подходит и оно не сожрет много ккал от общего значения, то добавляем его и выходим из цикла
                        if ((dinner[i].kkall + result_dishes[0].kkall) < (kkall + percent)) {
                            result_dishes.push(dinner[i]);
                            break;
                        }
                    }
                    //В противном случае, если мы не добавили на предыдущем шаге блюда, то - пропуск
                    if (result_dishes.length === 1)
                        result_dishes.push({
                            name: "Пропустить",
                            kkall: 0
                        })
                    //Аналогично
                    for (let i = 0; i < evening.length; i++) {
                        if ((evening[i].kkall + result_dishes[0].kkall + result_dishes[1].kkall) < (kkall + percent)) {
                            result_dishes.push(evening[i]);
                            break;
                        }
                    }
                    //Аналогично
                    if (result_dishes.length === 2)
                        result_dishes.push({
                            name: "Пропустить",
                            kkall: 0
                        })
                    //Записываем в бд наше блюдо
                    users_dishes.insertOne({user_id: id, day: dday, dishes: result_dishes, kkall});
                    result.result = true;
                    result.dishes = {user_id: id, day: dday, dishes: result_dishes};
                }
            } else {
                //В противном случае просто отправляем готовый рацион
                result.result = true;
                result.dishes = user_day;
            }
            //Немного костыльно наверное, но пока лучшей идеи не пришло, думаю не столь критично
            //Отправляем результат
            return res.end(JSON.stringify(result))
        case "getPlans":
            let wpls = await workouts_plans.find().toArray();
            result.plans = wpls;
            return res.end(JSON.stringify(result))
        case "getWorkouts":
            level = req.body.level;
            works = await workouts.find({level: level}).toArray()
            result.result = true;
            result.works = works;
            return res.end(JSON.stringify(result))
        case "getWorkout":
            level = req.body.level;
            let day = req.body.day;
            let plan_id = req.body.plan_id;
            works = await workouts.find({level: level, plan_id: ObjectId(plan_id)}).toArray()
            result.result = true;
            result.works = works;
            return res.end(JSON.stringify(result))
    }
    res.send('Hello World!')
})

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


