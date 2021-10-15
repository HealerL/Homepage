$(function(){
    let timeWidth = $('.time').css('width');

    // 游戏规则显示
    $('.ruleitem').click(function(){
        $('.rulebox').stop().fadeIn(100);
    });
    // 游戏规则关闭
    $('.close').click(function(){
        $('.rulebox').stop().fadeOut(100);
    });

    // 游戏开始按钮点击后隐藏
    $('.start').click(function(){
        // 分数清零
        $('.point').text('0');
        $(this).stop().fadeOut(100);
        
        // 随机显示一只狼
        showWolf();

        // 进度条动画开始运动 进度条动画结束后显示游戏结束界面
        $('.time').animate({
            width: 0
        }, 10000, function(){
            $('.mask').stop().fadeIn(100);
            stopShowWolf();
        })
    })

    // 点击重新开始按钮
    $('.restart').click(function(){
        $('.mask').stop().fadeOut(100);
        // 进度条长度恢复
        $('.time').css('width', timeWidth);
        // // 重新显示开始按钮
        // $('.start').stop().fadeIn(100);
        
        // 或者直接开始
        $('.start').trigger('click');
    });

    // 图片和位置            
    let bigwolf_array = ['images/h0.png',
                          'images/h1.png',
                          'images/h2.png',
                          'images/h3.png',
                          'images/h4.png',
                          'images/h5.png',
                          'images/h6.png',
                          'images/h7.png',
                          'images/h8.png',
                          'images/h9.png'
                        ];
        
    let littlewolf_array = [
                        'images/x0.png',
                        'images/x1.png',
                        'images/x2.png',
                        'images/x3.png',
                        'images/x4.png',
                        'images/x5.png',
                        'images/x6.png',
                        'images/x7.png',
                        'images/x8.png',
                        'images/x9.png'

    ];
            
    let position_array = [{left:'100px', top:'115px'},
                            {left:'20px', top:'160px'},
                            {left:'190px', top:'142px'},
                            {left:'105px', top:'193px'},
                            {left:'19px', top:'221px'},
                            {left:'202px', top:'212px'},
                            {left:'120px', top:'275px'},
                            {left:'30px', top:'295px'},
                            {left:'209px', top:'297px'}
                        ];


    let wolfall = [bigwolf_array, littlewolf_array];
    // 存储定时器的变量放在外面方便删除
    let timer;

    // 使用全局变量来控制图片正常播放的索引范围和拍打后的索引范围
    let imgstart,
        imgend;

    // 随机在一个位置显示灰太狼或小灰灰的函数
    function showWolf(){
        
        let randomindex = Math.round(Math.random()*8);
        // 为狼图片添加一个类，方便在其他函数中操作图片
        let $wolfimg = $('<img src="" class="wolf">');

        $wolfimg.css({
            position: 'absolute',
            left: position_array[randomindex].left,
            top: position_array[randomindex].top
        })

        // 随机狼的种类并添加对应的类来区分
        let wolfindex = Math.round(Math.random());
        if (wolfindex == 0){
            $wolfimg.addClass('big');
        }
        else $wolfimg.addClass('small');

        // 定时函数修改图片
        imgstart = 0;
        imgend = 6;
        timer = setInterval(function(){
            $wolfimg.attr('src', wolfall[wolfindex][imgstart]);
           
            imgstart++;
            // 一只狼显示结束后显示下一只
            if (imgstart >= imgend){
                $wolfimg.remove();
                clearInterval(timer);
                showWolf();
            }
        }, 200);
        $('.box').append($wolfimg);

        // 应用规则函数 添加对应的点击事件
        gameRule();
    };
    
    // 结束时 动画停止 狼消失
    function stopShowWolf(){
        $('.wolf').remove();
        clearInterval(timer)            
    }
    
    // 进行游戏的逻辑处理
    function gameRule(){
        // 点击事件只能触发一次，使用函数one
        $('.wolf').one('click', function(){
            // 不管图片动画执行到哪一张，只要点击后就直接显示索引6的图片
            // 表示拍打
            imgstart = 6;
            imgend = 9;
            let p = parseInt($('.point').text());
            // 根据打的狼来进行加分或者扣分
            if($(this).hasClass('big')){
                // console.log($('.point').text())
                $('.point').text(p+10);
            }
            else {
                $('.point').text(p-10);
            }
        });
    }

   

})