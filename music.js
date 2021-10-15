window.onload = function(){
     // 音乐控制
     let audio = document.getElementsByTagName('audio')[0];
    //  默认音量修改
     audio.volume = 0.2;
     let music_title = document.getElementById('music_title');
     // let music_source = document.getElementById('m_source');
 
     let music_title_list = ['海底', '一生所爱'];
     let music_src_list = ['audio/ocean.mp3', 'audio/love.mp3'];
     let music_time_list = [256, 273];
     let music_index = 0;
     let music_len = music_src_list.length;
     let audioControl = document.getElementsByClassName('audiocontrol');
 
 
 
     // 图片旋转函数
     let cd = document.getElementById('cdbox');
     function imgRotate(element){
         this.target = element;
         this.timer = null;
         this.angle = 5;
     }
     imgRotate.prototype.startRotate = function(){
         this.stopRotate();
         // 定时函数的this指针默认会指向window，
         // 所以要特殊处理，这里使用箭头函数来确保指向调用该函数的元素对象
         // https://www.cnblogs.com/zsqos/p/6188835.html
         this.timer = setInterval(()=>{
             // 定时函数每次旋转度数增加
             this.target.style.transform = 'rotate('+this.angle+ 'deg)';
             this.angle +=5;
             
         }, 50);
     }
     imgRotate.prototype.stopRotate = function(){
         if (this.timer){
             clearInterval(this.timer);
         }
     }
     imgRotate.prototype.reStart = function(){
         this.target.style.transform = 'rotate('+this.angle+ 'deg)';
     }
 
     let rotateImg = new imgRotate(cd);
     let bar_range = 157;
     // currentTime的输出是秒为单位，时间显示要改成分钟
     // 进度条移动 根据
     function processBar(current){
         this.currentElement = current;
         // this.audioTarget = target;
         this.countTime = 0;
         this.timer = null;
         this.moveflag = false;
     }
     processBar.prototype.Start = function(){
         clearInterval(this.timer);
         this.timer = setInterval(() => {
             this.countTime += 1;
             this.currentElement.style.width = (bar_range/music_time_list[music_index])*this.countTime/5 + 'px';
         }, 200)
     }
     processBar.prototype.Stop = function(){
         if (this.timer){
             clearInterval(this.timer);
         }
     }
     processBar.prototype.clear = function(){
         if (this.timer){
             clearInterval(this.timer);
         }
         this.countTime = 0;
         this.currentElement.style.width = 0 +'px';
     }
     
     let progress = document.querySelector('.progress');
     let nowprogress = document.querySelector('.nowprogress');
     // console.log(progress)
     let p_bar = new processBar(nowprogress);
 
     let icon = document.querySelector('#progress_circle');
     let bgprocess = document.querySelector('.progress');
     // 进度条起始位置相对左侧的长度, 当进度条展开后进行计算
     let bar_start_offset;
 
     console.log(bar_start_offset);
     // 不冒泡
     icon.addEventListener('mousedown', function(event){
         this.style.backgroundColor = 'yellow';
         p_bar.moveflag = true;
     });
 
     document.addEventListener('mousemove', function(event){
         if (p_bar.moveflag){
             let distance = event.clientX - bar_start_offset;
             if (distance > bar_range) distance = bar_range;
             else if (distance < 0) distance = 0;
             // console.log(distance);
             nowprogress.style.width = distance + 'px';
             // 拖动的时候停止进度条的自动前进行为
             p_bar.Stop();
         }
     });
     document.addEventListener('mouseup', function(event){
         // 标志位检测确保正在拖动时的释放鼠标行为才会触发
         if (p_bar.moveflag){
             p_bar.moveflag = false;            
             icon.style.backgroundColor = 'rgb(243, 168, 107)';
             updateProgress(event);
             // 进度条动画恢复
             p_bar.Start();         
         }       
     });
 
     function updateProgress(event){
         let temp = event.clientX - bar_start_offset;
         // if (p_bar.moveflag) console.log(temp);
         if (temp > bar_range) temp = bar_range;
         else if (temp < 0) temp = 0;
        //  console.log(temp)
         nowprogress.style.width = temp + 'px';
         let audiotime = temp/(progress.offsetWidth - (icon.offsetWidth/2)) * music_time_list[music_index];
        //  console.log(audiotime);
         if (audiotime >  music_time_list[music_index]) {
             audioNext.click();
         }
         else audio.currentTime = audiotime;  
         // 更新进度条对象的时间统计
         p_bar.countTime = audio.currentTime *5;
         
         // 如果当前暂停状态，点击就自动触发播放
         if (audio.paused){
             audioPlay.click(); 
         }
         //  跳转的时候立刻更新时间
         timeobject.timeCount();
     }
 
 
     // 点击进度条音乐进程跳转
     progress.addEventListener('click', function(event){
         // 鼠标释放事件发生在点击事件之前，所以这里检测为
         updateProgress(event);
        //  console.log(event.clientX);
        
     })
     
 
     // 歌曲时间的变化
     function SongTime(currentElement, endElement){
         this.cur = currentElement;
         this.end = endElement;
         this.timer = null;
     }
     SongTime.prototype.timeCount = function(){
         clearInterval(this.timer);
         let nowtime = audio.currentTime;
         convertTime(this.cur, nowtime);
         this.timer = setInterval(()=>{
             let nowtime = audio.currentTime;
             convertTime(this.cur, nowtime);
         },1000);
     }
 
     SongTime.prototype.stopTime = function(){
         if (this.timer){
             clearInterval(this.timer);
         }       
     }
 
     function convertTime(target, time_input){
         let second = Math.round(time_input%60);
         
         let minute = Math.floor(time_input/60); 
         if (second === 60){
             second = 0;
             minute += 1;
         }
         if (second<10){
             second = '0'+second;
         }
         if (minute < 10){
             minute = '0' + minute;
         }
         target.innerHTML = minute + ':'+second;
     }
 
     let left_time = document.querySelector('#timenow');
     let right_time = document.querySelector('#timeall');
     let timeobject = new SongTime(left_time, right_time);
 
 
 
 
     // 音乐播放与暂停
     
     let audioPlay = audioControl[1];
     audioPlay.addEventListener('click', function(){
         if (audio.paused){
             audio.play();
             this.children[0].src = 'img/stop.jpg';
             rotateImg.startRotate();
             p_bar.Start();
             timeobject.timeCount();
 
 
         }
         else {
             audio.pause();
             this.children[0].src = 'img/play.jpg';
             rotateImg.stopRotate();
             p_bar.Stop();
             timeobject.stopTime();
         }
     })
     // 后退
     let audioBack = audioControl[0];
     audioBack.addEventListener('click', function(){
         audio.pause();
         
 
         if (music_index==0){
             music_index = music_len-1;
         }
         else music_index--;
         audio.src = music_src_list[music_index];
         audioPlay.children[0].src = 'img/stop.jpg';
         music_title.innerHTML = music_title_list[music_index];
         audio.play();
         rotateImg.stopRotate();
         // rotateImg.reStart();
         rotateImg.startRotate();
         // 清零进度条和计时器然后重新启动
         p_bar.clear();
         p_bar.Start();
         // 修改音乐时间
         convertTime(left_time, 0);
         convertTime(right_time, music_time_list[music_index]);
     })
     // 前进
     let audioNext = audioControl[2];
     audioNext.addEventListener('click', function(){
         audio.pause();
         audioPlay.children[0].src = 'img/play.jpg';
         if (music_index>=music_len-1){
             music_index = 0;
         }
         else music_index++;
         audio.src = music_src_list[music_index];
         audioPlay.children[0].src = 'img/stop.jpg';
         music_title.innerHTML = music_title_list[music_index];
         audio.play();
         rotateImg.stopRotate();
         // rotateImg.reStart();
         rotateImg.startRotate();
         p_bar.clear();
         p_bar.Start();
         convertTime(left_time, 0);
         convertTime(right_time, music_time_list[music_index]);
     })
 
     // 音量控制
     let upButton = document.getElementById('v_up');
     let downButton = document.getElementById('v_down');
 
     upButton.addEventListener('click', function(){
         if (audio.volume+0.1 >= 1) audio.volume = 1;
         else audio.volume += 0.1;
         console.log(audio.volume);
     })
 
     downButton.addEventListener('click', function(){
         if (audio.volume-0.1 <= 0) audio.volume = 0;
         else audio.volume -= 0.1;
         console.log(audio.volume);
     })
 
     // 音乐循环播放
     audio.addEventListener('ended',function(){
         audioNext.click();
     })
 
     // 音乐部分的收起与隐藏
     let show_flag = false;
     $('#up_hide').click(function(){
        if (show_flag == false){
            $('.wrap_left').stop();
            $('.wrap_left').animate({
                height: '900px'
            }, 1000);
            $(this).text('hide');
            show_flag = true;
            // music是绝对定位，父元素是静态定位，所以他的偏移量这里就是相对页面的偏移
            bar_start_offset =  document.querySelector('.wrap_left').offsetLeft +
                                document.querySelector('.music').offsetLeft + 
                                document.querySelector('.musicbg').offsetLeft + 
                                progress.offsetLeft;
            console.log(bar_start_offset);
        }
        else{
        $('.wrap_left').stop();
        $('.wrap_left').animate({
            height: '420px'
        }, 1000);
            $(this).text('show');
            show_flag = false;
            
            
        }
     })
}