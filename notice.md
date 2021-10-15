遇到的注意点：

1. 绝对定位元素使用`offsetLeft`和top获取的值，不再是相对父元素的偏移，而是相对于页面的偏移量。原因就在于父元素静态定位，而自身是绝对定位。以下有各种情况：

   1. position为fixed时，`offsetParent`为null，`offsettop`的值和top相等。此时元素是以视口来定位的。

   2. position非fixed，父级元素无定位（static）时，`offsetParent`为body。

   3. position非fixed，父级元素有定位时，`offsetParent`为最近的有定位的父级元素。

   4. body元素，`offsetParent`为null，`offsettop`为0（似乎是废话）。

`offsetParent`属性是偏移的参照点



2.     定时函数的this指针默认会指向window，

       所以要特殊处理，这里使用箭头函数来确保指向调用该函数的元素对象

       更多方法： https://www.cnblogs.com/zsqos/p/6188835.html



3. 使用弹性布局flex 就不需要float来使元素在一行排列了。

   

4. CSS3 @media 用法总结 https://www.jianshu.com/p/b8f375b52a61

   根据设备的尺寸等来调节网页的显示

   

5. `$('.img_list').stop(true,true);`

   stop方法用于在动画或效果完成之前，停止它们。

   ```
   $(selector).stop(stopAll,goToEnd);
   ```

   - **可选的 `stopAll` 参数规定是否应该清除动画队列**。默认是 false，即仅停止活动的动画，允许任何排入队列的动画向后执行。

     即是否要停止并清除所有动画，false就只停止当前的，后续动画紧接着执行，true就清除所有动画

   - **可选的 `goToEnd` 参数规定是否立即完成当前动画**。默认是 false，即当前动画停止。true的话就立刻完成当前动画。



   利用stop函数，当都赋值true可以快速执行完当前队列的动画，直接跳到动画帧结尾，可以用来处理多次点击的情况。



6. `textarea`的`maxlength`属性可以设置文本框输入的最多字数。，最少字符数为`minlength`属性控制



7. ```javascript
   // 获取子元素中指定索引的元素的jq对象
   $('.pointer').children().eq(index);
   // 获取子元素中指定元素的DOM对象
   $('.pointer').children()[index];
   ```

8. 对于英文文本，默认的换行规则只会在单词结束后换行，因此当输入长单词后会出现这个问题：

   ![image-20210930203357214](https://raw.githubusercontent.com/HealerL/Typora_img/main/images/image-20210930203357214.png)

   使用`word-break: break-all;`对超出一行的文本强制换行即可解决这个问题。



9.  `'false' == false` 会返回false，即字符串时与布尔值不相等，要注意。将布尔值添加为DOM元素的一个属性值时，读取会变成字符串格式，导致判断出错，因此可以使用数字标识加上`==`来进行判断。





10.  用JSON保存TO DO中项目的内容：标签，备注，时间，以及状态（是否完成）



11. 想尝试将symbol作为DOM元素属性，就能够快速找到符合条件的指定元素。但DOM属性是字符串形式，所以无法作为属性值添加。

    使用`new Date().getTime()`来生成一个标识符，通过标识符就可以在JSON对象数组中快速找到进行操作的列表对象。

    ```javascript
    // 建立一个标识符，这样在操作列表项时，能够在json对象中快速找到该目标
    if(!id){
        id = new Date().getTime();
    }
    $li.attr('data-id', id);
    ```

    ```javascript
    // 根据输入的jq对象，找到属性列表中对应的属性对象
    function findJsonObj($li){
    
        for(let i=0; i<todos.length; i++){
            if($li.attr('data-id') == todos[i].id){
                return i;
            }
        }
        return -1;
    }
    ```

    

​	



小问题：

1. 鼠标拖动进度条然后释放的时候，释放位置不在进度条上时，进度条长度就会弹回去。

   结果显示调用了每次拖动调用了两次进度条点击事件，并且有一次偏移量会为0导致进度条弹回去。



原因是拖动进度条分为点击进度条事件，屏幕拖动事件，屏幕释放事件三部分。当屏幕释放事件在进度条上进行时，又会触发进度条的点击跳转事件。当不在进度条上释放时，不会触发进度条的点击事件。

目前的解决办法就是将跳转的函数封装起来，释放事件和点击事件都会调用这个函数，所以在进度条上释放还是会调用两次这个函数，但不会存在进度条长度弹回去的问题了。
