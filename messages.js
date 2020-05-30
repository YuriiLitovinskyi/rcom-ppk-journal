const convertIdMessage = (id) => {
    switch(id){
        case "1":
            return "Немає зв'язку з приладом";
        case "2":
            return "Зв'язок з приладом відновлено";
        case "3":
            return "КЗ шлейфа";
        case "4":
            return "Обрив шлейфа";
        case "5":
            return "Норма шлейфа";
        case "6":
            return "Несправність шлейфа";
        case "7":
            return "Взята під охорону група";
        case "8":
            return "Знята з охорони група";
        case "9":
            return "Відповідь на опитування - Під охороною група";    
        case "10":
            return "Відповідь на опитування - Знята з охорони група";
        case "11":
            return "Відсутня мережа 220В";
        case "12":
            return "Відновлено мережу 220В";
        case "13":
            return "Акумулятор в нормі";
        case "14":
            return "Акумулятор розряджений";
        case "15":
            return "Відкрито дверці приладу";
        case "16":
            return "Закрито дверці приладу";
        case "17":
            return "Рестарт приладу";
        case "18":
            return "Перевірка зв'язку - Успішно";
        case "19":
            return "Прилад виведено з режиму консервації";
        case "22":
            return "Включено (прилад приписаний)";
        case "23":
            return "Виключено (прилад відписаний)";
        case "24":
            return "Ідентифікація відповідального";
        case "25":
            return "Ідентифікація відповідального під примусом!";
        case "26":
            return "Відкритий корпус адаптера";
        case "27":
            return "Закритий корпус адаптера";
        case "28":
            return "Немає зв'язку з адаптером";
        case "29":
            return "Зв'язок відновлено з адаптером";
        case "30":
            return "Аварія живлення адаптера";
        case "31":
            return "Норма живлення адаптера";
        case "32":
            return "Запит на повторну передачу пакету прошивки (4L)";
        case "33":
            return "Отримано пакет завершення прошивки (4L)";
        case "34":
            return "Запит на повторну передачу пакету конфігурації (4L)";
        case "35":
            return "Отримано пакет завершення конфігурації (4L)";
        case "36":
            return "Завершення конфігурації (4L)";
        case "37":
            return "Прилад ініціює запит поточної сім-карти";
        case "38":
            return "Прилад ініціює запит IMEI";
        case "39":
            return "Прилад ініціює запит координат";
        case "40":
            return "Прилад ініціює запит рівня сигналу CSQ";
        case "41":
            return "Включено реле 0";
        case "42":
            return "Виключено реле 0";
        case "43":
            return "Включено UK1";
        case "44":
            return "Виключено UK1";
        case "45":
            return "Включено UK2";
        case "46":
            return "Виключено UK2";
        case "47":
            return "Включено UK3";
        case "48":
            return "Виключено UK3";
        case "49":
            return "Включено Реле 1";
        case "50":
            return "Виключено Реле 1";
        case "51":
            return "Включено Реле 2";
        case "52":
            return "Виключено Реле 2";
        case "53":
            return "Включено вихід С1";
        case "54":
            return "Виключено вихід С1";
        case "55":
            return "Включено вихід С2";
        case "56":
            return "Виключено вихід С2";
        case "57":
            return "Включено вихід С3";
        case "58":
            return "Виключено вихід С3";
        case "59":
            return "Версія прошивки";
        case "60":
            return "Зняття під примусом!";
        case "61":
            return "Відповідь на опитування - Обрив шлейфа";
        case "62":
            return "Відповідь на опитування - Норма шлейфа";
        default:
            return id;
    };
};

const convertLineMessage = (line, model) => {
    switch(line){
        case "24":
            return "24 - режим 'Залишаюсь вдома (4L)'";
        case "25":
            if(model && model === '4l' || model === '16L'){
                return '25 - Керування SET входом';
            } else if (model && model === '8L'){
                return '25 - Керування з мобільного додатку або з входу SET';
            } else {
                return '25';
            }; 
        case "26":
            return "26 - Вхід в режим конфігурування з системної клівіатури приладу";
        case "27":
            return "27 - Конфігурація приладу через USB";
        case "28":
            return "28 - Конфігурація приладу через Інтернет";
        case "29":
            return "29 - Управління групою з мобільного додатку (4L)";
        // case "30":
        //     return "30 - Керування статусами групи 1 за допомогою радіобрелока Crow";
        default:
            return line;
    };
};

const enabledStatus = (enabled) => {
    switch(enabled){
        case true:
            return "Приписаний";
        case false:
            return "Відписаний";
        default:
            return enabled;
    }
};


module.exports = {
    convertIdMessage,
    convertLineMessage,
    enabledStatus
};