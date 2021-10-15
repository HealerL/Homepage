$(function(){

    // 子菜单的显示
    // 注意先停止之前的动画再执行
    $('.nav_item').hover(function(){
        $(this).children('.conav').stop();
        $(this).children('.conav').slideDown();
        // alert(111)
    }, function(){
        $(this).children('.conav').stop();
        $(this).children('.conav').slideUp();
    })

    $('.conav li').hover(function(){
        $(this).children('.thirdnav').stop();
        $(this).children('.thirdnav').slideDown();
    }, function(){
        $(this).children('.thirdnav').stop();
        $(this).children('.thirdnav').slideUp();
    })

    // 焦点导致搜索框长度变化动画
    $('.inputsearch').focus(function(){
        $(this).stop();
        $(this).css('border-width', '2px');
        $(this).animate({
            width: '400px',
        })
        
    })
    $('.inputsearch').blur(function(){
        $(this).stop();
        $(this).css('border-width', '1px');
        $(this).animate({
            width: '200px'
        })
    })

    $('.search a').click(function(){
        // 使用谷歌进行搜索
        let text = $('.inputsearch').val();
        $(this).attr('href', `https://www.google.com/search?q=${text}&oq=${text}&aqs=chrome.1.69i57j0i512l9.1573j0j15&sourceid=chrome&ie=UTF-8`);
    })

    // 复制按钮
    // let copybutton = new Clipboard('.copy');
    let copy = new ClipboardJS('.copy');
    copy.on('success', function(e){
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        e.clearSelection();
    })

    $('.head_pic').click(function(){
        alert('别点我，疼！');
    })

    let img_index = 0;
    let img_width = $('.lunbo').width();
    let img_num = $('.img_list').children().length-1;
    let img_list_end = -(img_num)*(img_width);


    // 根据图片数量动态生成按钮
    for(let i=0; i<img_num; i++){
        $li = $('<li></li>');
        $li.css('float', 'left');

        $li.attr('index', i);
        $('.pointer').append($li);
        $li.click(function(){
            $(this).siblings().removeClass('current_point');
            $(this).addClass('current_point');
            
            img_index = parseInt($(this).attr('index'));
            // console.log(img_index);
            let position = -img_index*img_width;
            $('.img_list').css('margin-left', position);
        })
    }
    $('.pointer>li:first').addClass('current_point');



    function imgTimer(){
        this.timer = null;
    }
    imgTimer.prototype.setAutoTimer = function(){
        this.timer = setInterval(function(){
            $('#right_b').trigger('click');
        },3000);
    }
   imgTimer.prototype.clearTimer = function(){
       if (this.timer){
           clearInterval(this.timer);
       }
   }

  let auto_timer = new imgTimer();
  auto_timer.setAutoTimer();


    // 鼠标进入图片显示按钮
    $('.lunbo').hover(function(){
        $('#left_b').stop().show();
        $('#right_b').stop().show();
        auto_timer.clearTimer();
    }, function(){
        $('#left_b').stop().hide();
        $('#right_b').stop().hide();
        auto_timer.setAutoTimer();

    })

    // 鼠标移入按钮背景颜色变化
    $('.lunbo_button').hover(function(){
        $(this).css('backgroundColor', 'rgba(12,12,12,0.6)');
    }, function(){
        $(this).css('backgroundColor', 'rgb(204, 200, 200, 0.2)');
    })

    // 鼠标按钮点击图片移动
    $('#right_b').click(function(){
        // 快速执行完当前动画
        $('.img_list').stop(true,true);
        // 当前在索引5处即与第一张重复，先跳转到第一张再移动
        if (img_index == img_num){
            img_index = 0;
            $('.img_list').css('margin-left', 0);
        }
        let offset = -(img_index+1)*img_width;
        $('.img_list').animate({
            marginLeft: offset + 'px'
        },1000);
        img_index += 1;
        // console.log($('.pointer').children().eq(img_index));
        // 第五张图时会将第一张对应按钮点亮
        $('.pointer').children().eq(img_index%img_num).siblings().removeClass('current_point');         
        $('.pointer').children().eq(img_index%img_num).addClass('current_point');
        
    })

    $('#left_b').click(function(){
        $('.img_list').stop(true,true);
        // 超出范围时先跳转再移动
        if (img_index <= 0){
            $('.img_list').css('margin-left', img_list_end);
            img_index = 5;
        }
        let offset = (img_index-1)*img_width;
        $('.img_list').animate({
            marginLeft: -offset + 'px'
        }, 1000);        
        img_index -= 1;

        $('.pointer').children().eq(img_index).siblings().removeClass('current_point');         
        $('.pointer').children().eq(img_index).addClass('current_point');
    })

    let todos = gennerateTodo_storage();
    // 不会实时更新，所以每次都要保存localStorage
    function gennerateTodo_storage(){
        let todos;
        if(localStorage.hasOwnProperty('todos')){
            todos = JSON.parse(localStorage.getItem('todos'));
            // todos = localStorage.getItem('todos');
        }
        else{
            todos = [];
        }
        return todos;
        // if(localStorage.hasOwnProperty('fin_todos')){
        //     un_todos = JSON.parse(localStorage.getItem('fin_todos'));
        // }
        // else{
        //     un_todos = [];
        //     // 不会实时更新，所以每次都要保存
        //     localStorage.setItem('un_todos', JSON.stringify(un_todos));
        // }
    }

    console.log(todos);
    // 界面刷新时自动载入之前的数据
    function reload(todos){
        todos.forEach(obj => {
           genNewTodo(obj.label, obj.value, obj.time, obj.status);
        });
    }
    
    reload(todos);

    function save(todos){
        localStorage.setItem('todos', JSON.stringify(todos));
    }


    // if(localStorage)
    // let un_todos = JSON.parse(localStorage.getItem('un_todos')) || [];
    // let fin_todos = JSON.parse(localStorage.getItem('fin_todos')) || [];


    $('.todo_button').click(function(){
        if ($('#todo_input').val()){
            let obj = genNewTodo($('#todo_class').val(), $('#todo_input').val());
            todos.push(obj);
            save(todos);
            $('#todo_input').val('');
        }
    })

    $('.todo').hover(function(){
        $('.submit_class').stop().fadeIn();
        $('.delete_class').stop().fadeIn();
    }, function(){
        $('.submit_class').stop().fadeOut();
        $('.delete_class').stop().fadeOut();
    })


    // 根据输入的jq对象，找到属性列表中对应的属性对象
    function findJsonObj($li){

        for(let i=0; i<todos.length; i++){
            if($li.attr('data-label') == todos[i].label &&
            $li.attr('data-value') == todos[i].value &&
            $li.attr('data-time') == todos[i].time &&
            $li.attr('data-status') == todos[i].status){
                return i;
            }
        }
        return -1;
    }



    $('.submit_class').click(function(){
        if ($('.unfinish_list').children().length){
            let $checked = $('.todo_check:checked');
            // 对每一个都调用
            $checked.each(function(){
                // 找到所在的列表项
                let $li = $(this).parentsUntil('.unfinish_list').eq(1);
                let  obj_index = findJsonObj($li);
                // console.log(obj_index);
                todos[obj_index].status = 1;
                save(todos);

                // 因为删除元素，需要通过选择器来指定，所以添加一个类表示已经选择
                $li.addClass('selected');
                $('.unfinish_list').remove('.selected');
                
                // 取消已选中状态，利用删除属性来实现
                $(this).removeAttr('checked');
                $li.removeClass('selected');
                $('.finished_list').append($li);


            })
        }
    })

    $('.delete_class').click(function(){
        let $checked = $('.finished_list .todo_check:checked');
        console.log($checked.length);
        
        // 先删除完成的
        $checked.each(function(){
            let $li = $(this).parentsUntil('.finished_list').eq(1);
            // 因为删除元素，需要通过选择器来指定，所以添加一个类表示已经选择
            $li.addClass('selected');
            // $li.css('display', 'none');
            let  obj_index = findJsonObj($li);
            todos.splice(obj_index, 1);
            save(todos);
            
        })
        $('.selected').remove();

        // 下面这个方法这里无法删除 原因未知
        // $('.finished_list').remove('.selected');
        $checked = $('.unfinish_list .todo_check:checked');
        if ($checked.length){
            // 确认一下是否删除未完成的任务
            if (confirm('确定要删除未完成的任务吗？')){
                // 删除未完成的
            
                $checked.each(function(){
                    let $li = $(this).parentsUntil('.unfinish_list').eq(1);

                    $li.addClass('selected');
                    let  obj_index = findJsonObj($li);
                    todos.splice(obj_index,1);
                    save(todos);
                })
                $('.selected').remove();
            }
            else $checked.removeAttr('checked');
        }
        
    })

    // 生成一个待办事项 status表示是否完成，用数字表示是因为布尔值在字符串容易出问题
    function genNewTodo(label, value, time=null, status=0){
        let $li = $(`<li></li>`);
        $li.addClass('todo_list_item');
        // 添加列表项的第一行
        let $span = $(`<span></span>`);
        $span.addClass('todo_item_title');
        $span.append($(`<span>${label}</span>`));

        let $check = $(`<input type='checkbox'>`);
        $check.addClass('todo_check');
        let $show = $(`<span></span>`);
        $show.addClass('triangle');
        // 记录当前是展开还是收起状态
        $show.attr('data-click', false);

        console.log($show.attr('data-click'));
        $span.append($show);
        $span.append($check);
        
        let $div = $(`<div>${value}</div>`);

        let now_time;
        if(!time){
            time = getformatTime();
        }
        now_time = time;

        $div.append($(`<p>${now_time}</p>`));
        $div.addClass('todo_divbox');
        $li.append($span);
        $li.append($div);
        // 下拉展示
        $show.click(function(){
            if ($(this).attr('data-click') === 'false'){
                $li.children().eq(1).stop().slideDown();
                $(this).attr('data-click', true);
                $(this).css({
                    marginTop: -5 + 'px',
                    border: '8px solid transparent',
                    borderBottom: '8px solid white',
                })
            }
            else {
                $li.children().eq(1).stop().slideUp();
                $(this).attr('data-click', false);
                $(this).css({
                    marginTop: 4 + 'px',
                    border: '8px solid transparent',
                    borderTop: '8px solid white',
                })
            }
        })
        // 将这个列表项的信息作为属性保存，方便访问
        $li.attr('data-label', label);
        $li.attr('data-value', value);
        $li.attr('data-time', now_time);
        $li.attr('data-status', status);

        if(status == 0){   
            $('.unfinish_list').prepend($li);
        }
        else {
        $('.finished_list').prepend($li);

        }
        // 返回该事项的信息对象
        return {
            label,
            value,
            time: now_time,
            status,
        };
    }





    /*
    *@return year:month:day hour:minute 
    */
    function getformatTime(){
        
        let now = new Date();
        let res = now.getFullYear() + '.' + (now.getMonth()+1) + '.' + now.getDate() +
                 ' ' + now.getHours() + ':' + (now.getMinutes()>=10? now.getMinutes(): '0'+now.getMinutes());
        return res;
    }


    $('#code_show').hover(function(){
        $(this).css('background-color', 'rgba(205, 92, 92, 0.5)');
    }, function(){
        $(this).css('background-color', 'rgb(205, 92, 92)');
    })

    $('#code_show').mousedown(function(){
        $(this).css('border', '2px solid black');
    })
    $('#code_show').mouseup(function(){
        $(this).css('border', 'none');
    })
    
    

   
})