$(function(){
    function draw(){
        let date = new Date();
        let second = date.getSeconds();
        let minute = date.getMinutes();
        // console.log(minute)
        let hour = date.getHours();
        hour = hour>=12 ? hour-12:hour;
        
        let canvas = document.querySelector('#clock')
        let ctx = canvas.getContext('2d');
        // 需要记录初始状态，动画每次生成时要从初始状态开始操作
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(110,110);
        // ctx.save();

        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#383A94';
        ctx.arc(0,0,100,0,Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.lineCap = 'round';

        // 
        ctx.save();
        //画时间刻度

        ctx.strokeStyle = 'grey';
        for(let i=0; i<12; i++){
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.rotate(Math.PI/6);
            ctx.moveTo(0, -90);
            ctx.lineTo(0, -70);
            ctx.stroke();
        }
        ctx.restore();

        // 画分钟刻度
        ctx.save();
        ctx.strokeStyle = 'grey';
        for(let j=0; j<60; j++){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.rotate(Math.PI/30);
            ctx.moveTo(0, -90);
            ctx.lineTo(0, -85);
            ctx.stroke();
        }
        ctx.restore();

        
        // 画时针
        // 每次画一条线都要先调用begin函数，不然上一条线的末尾点也会进行接下来的操作
        // 每次旋转前都要保存一下状态，旋转后恢复状态
        ctx.strokeStyle = 'black'; 
        ctx.save();
        ctx.beginPath();
        // 先转更改坐标轴，再确定起点 进行连接，再显示
        // 先确定起点再转会导致线条不经过圆心
        ctx.rotate(hour*(Math.PI/6) + minute*(Math.PI/360) + second*(Math.PI/21600));
        ctx.moveTo(0,7);             
        ctx.lineWidth = 7;
           
        // console.log(hour)
        ctx.lineTo(0, -40);
        ctx.stroke();
        ctx.restore();
        
        // 画分针
        ctx.save();
        ctx.beginPath();
        ctx.rotate(minute*(Math.PI/30)+second*(Math.PI/1800));
        ctx.moveTo(0, 10);
        ctx.lineWidth = 4;
        
        ctx.lineTo(0, -60);
        ctx.stroke();
        ctx.restore();

        // 画秒针

        ctx.save();
        ctx.beginPath();
        ctx.rotate(second*(Math.PI/30));
        ctx.moveTo(0, 20);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.lineTo(0, -70);
        // ctx.arc(0,-135, 10, 0, Math.PI*2);
        ctx.stroke();

        // 画中心的圆
        ctx.beginPath();
        ctx.moveTo(0,0);
        // 填充中心的红色圆
        ctx.arc(0, 0, 5, 0, Math.PI*2);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.restore();

        // 这个restore回到初始状态
        ctx.restore();

        window.requestAnimationFrame(draw);

    }
    window.requestAnimationFrame(draw);



    
})