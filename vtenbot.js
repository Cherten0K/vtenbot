// ==UserScript==
// @name         VTen.ru Bot
// @version      0.1
// @description  Bot game world of shadows
// @author       cherten0K
// @include        http://m.vten.ru/*
// @grant        none
// ==/UserScript==

(function (window, undefined) {
    var w;
    var defaultCountSphere = 4;
    if (typeof(unsafeWindow) != 'undefined') {
        w = unsafeWindow;
    } else {
        w = window;
    }
    //if (w.self != w.top) {
    //    return;
    //}
    if (/http:\/\/m.vten.ru/.test(w.location.href)) {
        set_default();

        display_menu();       

        start_bot();
    }    

    function set_default(){
        var actions = ['Атаковать', 'Гром и Молния', 
                       'Ярость Богов', 'Защита Богов', 'Талисман Доблести', 'Рывок Жизни', 
                       'Приток Силы', 'Взрыв Эфира', 'Сферы Арканы', 'Тень Смерти',
                       'Форма Демона', 'Листок Лотоса', 'Кровавый Цветок', 'Проклятие Глайва'];
        for (var actionNumber in actions){
            if (localStorage[actions[actionNumber]] === null) localStorage[actions[actionNumber]] = 'false';
        }
        if (localStorage['Количество Сфер'] === null) localStorage['Количество Сфер'] = 0;
        if (localStorage['Максимальное Количество Сфер'] === null) localStorage['Максимальное Количество Сфер'] = 4;
    }

    function display_menu(){
        var menu = document.createElement('div');
        if (document.querySelector('.combat-line [href*="ppAction=damage"]') !== null){
            var checkbox = document.createElement('input');            
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', "Атаковать");
            checkbox.setAttribute('onchange', 'changeVariable("Атаковать")');
            if (localStorage["Атаковать"] == 'true') checkbox.setAttribute('checked', '');
            document.querySelector('.combat-line [href*="ppAction=damage"]').parentNode.insertBefore(checkbox, document.querySelector('.combat-line [href*="ppAction=damage"]'));      
        }
        var amulets = document.querySelectorAll('.combat-line .btn-red[href*="ppAction=useAmulet"]');
        for (var i=0;i<amulets.length;i++){
            var nameAmulet = amulets[i].querySelector('span:not(.locked-time)').textContent.trim();
            var checkbox = document.createElement('input');            
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', nameAmulet);
            checkbox.setAttribute('onchange', 'changeVariable("'+nameAmulet+'")');
            checkbox.setAttribute('class', 'btn-red inactive');
            if (localStorage[nameAmulet] == 'true') checkbox.setAttribute('checked', '');
            amulets[i].parentNode.insertBefore(checkbox, amulets[i]);
            switch (nameAmulet){
                case 'Сферы Арканы':                    
                    var countSphere = document.createElement('input');
                    countSphere.setAttribute('type', 'number');
                    countSphere.setAttribute('min', '0');
                    countSphere.setAttribute('max', '4');
                    countSphere.setAttribute('id', 'Количество Сфер');
                    countSphere.setAttribute('value', localStorage['Максимальное Количество Сфер']);
                    countSphere.addEventListener('input', function(){localStorage['Максимальное Количество Сфер'] = countSphere.value;});
                    amulets[i].parentNode.insertBefore(countSphere, amulets[i]);
                    break;
            }
            
        } 
        var p = document.head || document.documentElement || document.body; 
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.appendChild(document.createTextNode(
            'function changeVariable(amulet){localStorage[amulet] = document.getElementById(amulet).checked;}'));
        p.appendChild(script);
    }

    function start_bot(){
        var activeAmulets = document.querySelectorAll('.combat-line .btn-red:not(.inactive):not(.inactive45)[href*="ppAction=useAmulet"]');
        var firstActiveAmulet = null;
        for (var i=0;i<activeAmulets.length; i++){
            if (localStorage[activeAmulets[i].text.trim()] == "true") {
                switch (activeAmulets[i].text.trim()){
                    case 'Сферы Арканы':
                        if (parseInt(localStorage['Количество Сфер'])<localStorage['Максимальное Количество Сфер']){
                            firstActiveAmulet = activeAmulets[i];
                            localStorage['Количество Сфер'] = parseInt(localStorage['Количество Сфер'])+1;
                        }
                        break;
                    case 'Взрыв Эфира':
                        localStorage['Количество Сфер'] = 0;
                        firstActiveAmulet = activeAmulets[i];
                        break;
                    default:
                        firstActiveAmulet = activeAmulets[i];
                        break;
                }
                if (firstActiveAmulet !== null) break;
            }
        }
        if (firstActiveAmulet !== null) w.setTimeout(function(){firstActiveAmulet.click();}, 500);
        else {
            var damageButton = document.querySelector('.combat-line [href*="ppAction=damage"]');
            if (damageButton !== null && localStorage["Атаковать"] != "false")
                w.setTimeout(function(){damageButton.click();}, 1000);
        }
        
        var refreshButton = document.querySelector('a[href*="efresh"]');
        //if (refreshButton !== null) w.setTimeout(function(){refreshButton.click();}, 3000);
    }    
})(window);