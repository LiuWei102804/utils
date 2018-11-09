(function ( global ) {
    "use strict"
    var ElemPlatform = typeof Elem === "undefined";
    var icons = {
        succ : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBBMEM5MkU2OTZGQTExRTg4NkQzRTNBNDQ3QTY3NjlFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBBMEM5MkU3OTZGQTExRTg4NkQzRTNBNDQ3QTY3NjlFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEEwQzkyRTQ5NkZBMTFFODg2RDNFM0E0NDdBNjc2OUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEEwQzkyRTU5NkZBMTFFODg2RDNFM0E0NDdBNjc2OUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ZrBKbAAABQ0lEQVR42mL8//8/w0AAJoYBAsPe4ngg7kARAcUxjXEwEP/8DwFNMHFaWxoIxL/+o4J6WlscCsQ//mMHExhplJ2CgXgJEHPgkL9LC5/6YQleZHAViBVoEbzfCFgqT+04DkRKvXgtxWWxGBAbkpFl8AXvFSCWQ9aDboAIEJ8E4s9A7ExC8H4nYKkMuj5kjjAQH0LS8BaIHSgM3kvoPkW3GOTT41g0gnxuhcPSICJSrxwuR8MY6/AY8BqIHbFY+pXYhITPYlB8vsNjECjYraFqfSjxKbY4toBagAu8gRby3ynxKa5UbQvEr/6TBy4DsSyxWRCboBWBYCcp9ZJiMSzYXxNp6VVSfEpMfWxJRLBfJsdSYspqcyB+T0nqJddiBmg2ek1u6qXEYlhqf00tS0mtFkGW76WGpSBMq6bPaIN+8FgMEGAAlmQsvQmOonMAAAAASUVORK5CYII=" ,
        err : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAWvSURBVHjatJZdiF3VFcd/a599zpz7OXfmxsmEpChGRC1RsIml0wQEKbZMHwpSP0ihgqn64FMxtvbBhxSaUqEPQilYKRSqLe1Dk4cphbYQOiUPMakPEr9QOxUbJyYzd+69c+eee885e/XhnDv3TjIziVXX0+Hsvdd/7f9e67+W9M/+DanvxlQmEGvBGBBByjW024Y0gTSFOAJ14HlIscjaL48T/fmPmNokA9NuB3/mfrwv7v+RdjuPAzflK4hYwAOUwkOPYfksLYkx9Z0EB+59XgL/FRR0bRUplUneep3k/XeQsRBgE2B1e0GOZt8K6l5GdX7DHjFo1EWbDdTzhkeby0eBvWbHdFcCPwIsUfcoYQEpLWTM5TYCrBnNNqhi5AkAPAuefY24P08cDbf2I+wttxPc901MsTL00Gk/bW+5fQqUQeDaiy5KWPgFadpFZBNg527EmN0SlvaRr4sdA8+7GWRGO80mRs5nAKv4B+/HP/QNYOiMNH1Fbtj1bQmC3UME/3mgh3PncOkiqu+PAlcw5qeIPIw6EJP9zWh8BngG450HdxBYwSWYiV1QqI4+QA34IVACvpdFLkipDPACvg9j4W8w5tEhcJr+Torlr0lYYpSOdQtCZLx+mzYunsXzbgMSnBvdYVE9i0gtB77K/Dv3Yybr7eTd8wAYYMFMTs1KWAw2Bc0jxw89mdi5F/Q06qZHVqeB04jsBepAuJkLFYMmyVMYszC48YsShE3EJMAh4PCW4EEBKU8e0KjzEi59PF95ETiwXZWpS6HXO0HcO4VqaQD8E9BMKOJuhPEPE4RbewmKUNkxSxAey//MXqu2cekcqs8h5vWNWS0G4h7avNQkLJ+WILTA3ZvWOSCVOsBj1xQUJdF+/C8CewRrFteTdoNjETDeCcScQNUHFhGZ/DQqpu1GC8xBUhvjFJL+ZgJCVpMuhahTAVehUNlYp5/AdHmR+NSfKnh+BZFlXAphBYrjI8B5YxixFpiD7uIHJ6Vcm5bS+CfB/BlwEueg20mwfmv9QnZs5MbWomtN8EPUeJk+x1GCyBk6K0cIwh9QGj90XZAuhbj3D0RO04vQOEYGjKnLO12SAbulS8jEFKZaB8mANc7eQqo75iiUZvIyuw5+gTh6hDRpYb1579a7sot4Fu33wfORQiUH/uhDvBtvRTwPzaPJlehuqe+yiLkDVbYUl1EzHtixw6hamZiat1/Zg2s2YKyAdjrQWV1PGYu12YEsqwcuqqj+kzTxscH1gea5SViCsNTIqFfo9zIm+lGW1cYMk8uUJ5HSBIIbZHEb1TbG+3/LKV7v51vYUEBE8tGEaeAkQvVTzCIPAl/KGxBYfQBYvBp40LjRfSDHgXu2dduPwMVZedhgsx07gZ0YQepTEHVfUueeBdYl04xsvgc4dk3tRSGNf+8+/uCCNj66APx26zcXpFiBYmUWkWMkyaHB+GOB+xDTA34M3Ls9poLoq3j2EVqXv6/RKjK559eg38HbZm4MC5jK+LfUOYe18wPgv5DG9polo5ri0gWMmclHmp9rmqJr7S/jkhWp1mtbnRfnoFZfk4kdC4NnNcB08p+339B2Y3thcOlbwH6E5Ao6zyGyH5ckWx1PlxbRTvMY8NxgcjHAEkn8IGK+muvsRsx+D427pxB5CFjZrA8B7wEzV2buemxh4UmpTPwKkc7gSSyA+MF5t7wIly/sk1IVM7VneMj3X0bkBcgmzGwYKGSjbxyP+n8VOKKtxnGQfVKt4S5dJJr7A7raOiOF0jLWB5Tid5/Ky8nz0NYyrrXyhhTLcyizUh7HXf4vutr6K9aeEetnSmQEjfvI6hJU61debk7bTR9jvi7VGtpYov/3ObTVbKm1DGgeAudCLoXiPEmSJv9+e9b7ws0kb55DlxfDK2tVkwR7Qx2vvutqXr18mACwFqnWAEF8fyP9uo2sfZ72vwEAK0w1ZCV1tesAAAAASUVORK5CYII=" ,
        info : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYxNjc1MDk2OTZGODExRThBMzUyQzNERDc0MDMyNUUxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYxNjc1MDk3OTZGODExRThBMzUyQzNERDc0MDMyNUUxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjE2NzUwOTQ5NkY4MTFFOEEzNTJDM0RENzQwMzI1RTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjE2NzUwOTU5NkY4MTFFOEEzNTJDM0RENzQwMzI1RTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qAPlSAAABTUlEQVR42uyVzU6DQBSF7x2m0BSkRo3Gatx05yu4deNb9SGbuLaoaTUtIK0Kw8wVEupGU/5EFuUmk5DJcL6ckzMZJCKoMgfDo97o4mpo2YeDwPfk/NlZrQP3UylVSBCrgAWA9upK+3GFU9OA3nKN7pkd3Zm6Mb88gY/kSL5oCi6zPM/DMCYjWRsplYglKSEofHlTs9lSjqcPZE4mhHk6pR0LASiIwoGOPE0MMnuSIL5/Uo6u0Y1zri1uAdQuHVY2ZkxQCVTbQiH74AjaqY22rjNtVECnNJjz3/9LE9xEIBnR+3WO20rgLFn8sYcQHVswVoIFjbV6OwsfyOoT9A1kSfbMT5wOizS6LrjOMGhp9g/MKzR6Z2eacpwKYyTrO67TavpPx98Tq5bKVff6d/e4A3fgPQZTW2DOWgIzrBcEbyBlKvJSVQHjX5TrS4ABAP0cwpTE5eY4AAAAAElFTkSuQmCC" ,
        warn : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdCNUFDRjY2OTZGQjExRTg5NjM1Q0Q3NDFBRjJBNUQxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdCNUFDRjY3OTZGQjExRTg5NjM1Q0Q3NDFBRjJBNUQxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0I1QUNGNjQ5NkZCMTFFODk2MzVDRDc0MUFGMkE1RDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0I1QUNGNjU5NkZCMTFFODk2MzVDRDc0MUFGMkE1RDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6xS86mAAABbklEQVR42syWTUpDQRCEJ4lkqyK4FQTde4NcQPAMWbtz6wkEBa+hIII7wR9ciRolCAGJiQHFP1wYEVFRx2rogeeQgN2xJxZ85GUgXbxJT0/lvPeuHxpQ/CYHRsEsGAMXYBE8WRsPghlQBkNsWAMr4PfbR1stZA7U/U+1wJSkjsa45jtrSVInr9jqNvjssD4iKaIx3gIP0do7WLc2/mCyegENa+MNUI/WdsGltfEdv2FWdKSerY3fQJU/g07Al7UxNdYxd3dorL0unf6nxqRT3nLHb/8oLaAxprF4ljG7AtcpjMOMb/JzS1NAa0zneJ+fN8FrKmNSkTu5kPKNHf/PB+CW7+hkxhWwCs5F93BIEz1EnwInkXvpGe7VOHnmCpoEwzzJGvJpIE8gRTANDkETHIGStI7GuAyqUeyh7xPWxpUumWvBOnPdRFei04xOjfEy2InWKG+tWXf1Nscc6uZxHiDzPMH+/znOuz7pW4ABAJQOKpcyoaGGAAAAAElFTkSuQmCC" ,
        loading : "data:image/gif;base64,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"
    };


    if( ElemPlatform ) {
        var __count = -1,
            __elemList = new Array(),
            MAXW = global.document.documentElement.clientWidth,
            MAXH = global.document.documentElement.clientHeight;

        var Elem = function ( _el ) {
            if( Boolean( el ) && _el.nodeName ) return _el;
            var el;
            if( typeof _el === "string" ) {
                el = _el.replace(/^\s+|\s+$/g,"");
            } else {
                throw Error("非法参数");
            }

            //
            // // input[type=text] input[type] .test[attr=value]  元素名 + 属性选择器
            // if( /.+\[.+\]/.test( el ) ) {
            //     return Elem.getElByGroup( el );
            // // 派生选择器 header div i
            // } else if( /\s+/g.test( el ) && !/^</.test( el ) ) {
            //     var nodeName = el.split(" "),next = 0,els;
            //
            //     while( next < nodeName.length - 1 ) {
            //         els = Elem.filter( nodeName[next] , nodeName[next + 1] );
            //         next ++;
            //     }
            //     return els;
            //
            // } else {
                switch( el.charAt(0) ) {
                    case "#" :
                        return Elem.getElById( el );
                    case "." :
                        return Array.prototype.slice.call( Elem.getElByClass( el ) );
                    case "[" :
                        return Array.prototype.slice.call( Elem.getElByAttr( el ) );
                    case "<" :
                        return Elem.create( el );
                    default :
                        return Array.prototype.slice.call( Elem.getElByTagName( el ) );
                }
           // }
        };
        //通过ID获取元素
        Elem.getElById = function ( id , _p ) {
            var p = typeof _p !== "undefined" ? _p : document;
            return p.querySelector ? p.querySelector( id ) : p.getElementById( id.replace(/#*/,"") );
        };
        //通过class获取元素
        Elem.getElByClass = function ( cl , _p ) {
            var p = typeof _p !== "undefined" ? _p : document;
            if( typeof p.querySelectorAll === "function" ) {
                return p.querySelectorAll( cl );
            };
            if( typeof p.getElementsByClassName === "function" ) {
                return p.getElementsByClassName( cl.replace(/\.*/,"") );
            };
            var els = p.getElementsByTagName("*");
            var items = [];
            var realCl = cl.replace(/\.*/,"");
            for( var i = 0, len = els.length; i < len; i ++ ) {
                if( Boolean( els[i].className ) ) {
                    var classList = els[i].className.split(/\s+/g);
                    for( var j = 0, len2 = classList.length; j < len2; j ++ ) {
                        if( classList[j] === realCl ) {
                            items.push( els[i] );
                        }
                    }
                }
            }
            return items;
        };
        //通过tagName获取
        Elem.getElByTagName = function ( tgName , _p ) {
            var p = typeof _p !== "undefined" ? _p : document;
            return p.getElementsByTagName( tgName );
        };
        //通过属性获取元素
        Elem.getElByAttr = function ( attr , _p ) {
            var p = typeof _p !== "undefined" ? _p : document;
            var els = p.getElementsByTagName("*");
            var realAttr = attr.replace(/\[|\]/g,"").split(/=/);
            var items = [];
            for( var i = 0, len = els.length ; i < len; i ++ ) {
                if( els[i].hasAttributes() ) {
                    if( typeof realAttr[1] !== "undefined" ) {
                        if( els[i].hasAttribute( realAttr[0] ) && els[i].getAttribute( realAttr[0] ) === realAttr[1] ) {
                            items.push( els[i] );
                        }
                    } else {
                        if( els[i].hasAttribute( realAttr[0] ) ) {
                            items.push( els[i] );
                        }
                    }
                }
            }
            return items;
        };
        // //通过tagName + attr 获取
        // Elem.getElByGroup = function ( el ) {
        //     var s = el.indexOf("["),e = el.indexOf("]");
        //     var nodeName = el.substring(0,s),attrs = el.substring( s , e + 1 );
        //     var nodes  = Elem( attrs );
        //     var item = [];
        //     nodes.forEach(function ( v , k ) {
        //         var t = Elem.filterType( nodeName );
        //         if( v[t].toLowerCase() === nodeName.replace(/[\.*|#*]/,"").toLowerCase() ) {
        //             item.push( v );
        //         }
        //     });
        //     return item;
        // };
        //

        //filter 选择器 pname父级名称  name  子级名称 可以是class id nodeName
        // Elem.filter = function ( pname , name ) {
        //     var els = document.all,
        //         t = Elem.filterType( name ),
        //         p = typeof pname === "string" ? Elem.filterType( pname ) : pname,
        //         result = [];
        //
        //     for( var i = 0, len = els.length; i < len; i ++ ) {
        //         if( els[i][t].toLowerCase() == name.replace(/[\.*|#*]/,"") &&
        //              Elem.parents( els[i] , pname )[p].toLowerCase() == pname.replace(/[\.*|#*]/,"").toLowerCase() &&
        //              els[i] !== Elem.parents( els[i] , pname ) ) {
        //
        //             result.push( els[i] );
        //         }
        //     }
        //     return result;
        // };
        //获取父级
        // Elem.parents = function ( el , name ) {
        //     var p = el.parentNode;
        //
        //     while( typeof p.hasAttributes === "function" ) {
        //         if( typeof name === "string" ) {
        //             if( p.hasAttribute( Elem.filterType( name ) ) && p[Elem.filterType( name )].toLowerCase() === name.replace(/\.*|\#*/,"") ) {
        //                 return p;
        //             }
        //         } else {
        //             console.log( name )
        //         }
        //
        //         p = p.parentNode;
        //     }
        //     return el;
        // };
        //获取选择器类型
        // Elem.filterType = function ( name ) {
        //     switch( name.charAt(0) ) {
        //         case "#" :
        //             return "id";
        //         case "." :
        //             return "className";
        //         case "[" :
        //             return "Attribute";
        //         default :
        //             return "nodeName";
        //     }
        // };
        Elem.createMark = function () {
            var mark = this("<div style='position:fixed;width:100%;height:100%;top:0;left:0;z-index:9999;background-color:rgba(0,0,0,0.4)' />");
            return mark;
        };
        //创建元素
        Elem.create = function ( option ) {
            var nodeContent = option.substring( 0 , option.indexOf(">") ).replace("<","").replace(/\s+$/,"").replace(/"/g,"'");
            var hasAttr = nodeContent.indexOf(" ") > -1;    //是否带有属性
            //属性集合，元素tagName
            var attrs = [],styles,nodeName,inner;
            if( nodeContent[nodeContent.length - 1] === "/" ) {
                nodeContent = nodeContent.substring(0 , nodeContent.length - 1);
            }
            if( hasAttr ) {
                nodeName = nodeContent.substring(0,nodeContent.indexOf(" "));
                if( nodeContent.indexOf("style=") > -1 ) {
                    styles = nodeContent.substring( nodeContent.indexOf("style=") , nodeContent.indexOf( "'", nodeContent.indexOf("style=") + 7  ) + 1 );
                    nodeContent = nodeContent.replace( styles ,"" );
                }
                attrs = nodeContent.replace( nodeName , "" ).replace(/'/g,"").replace(/^\s+/,"").replace(/\s+$/,"").split(/\s/g);
            } else {
                nodeName = nodeContent;
                attrs = [];
            }
            styles && attrs.push( styles );


            var hasInner = option.lastIndexOf( "</" + nodeName + ">" ) > -1;            //是否创建多层元素
            if( hasInner ) {
                inner = option.substring( option.indexOf(">") + 1, option.lastIndexOf("</" + nodeName + ">"));
            } else {
                inner = "";
            }
            try{
                var node = document.createElement( nodeName );

                attrs.forEach(function ( item , index ) {
                    if( item != "" ) {
                        item = item.replace(/'/g,"");
                        if( item.indexOf("=") > -1 )
                            node.setAttribute( item.split("=")[0] ,item.split("=")[1]  );
                        else
                            node.setAttribute( item ,item  );
                    }
                });
                node.innerHTML = inner;
                return node;
            } catch ( e ) {
                console.error( e );
            } finally {

            }
            return null;
        };
        //关闭提示方法
        Elem.close = function( index ) {
            var i = 0;
            for( ; i < __elemList.length; i ++ ) {
                if( __elemList[i].mid == index ) {
                    try {
                        document.body.removeChild( __elemList[i] );
                    }catch ( e ) {
                        console.info( e );
                    } finally {
                        __elemList.splice( i , 1 );
                    }
                }
            }
        };

        //消息输入框
        Elem.prompt = function( cfg ) {
            var mark = this.createMark();
            __count += 1;

            mark.mid = __count;
            var opts = {
                title : cfg.title || "提示" ,
                msg : cfg.msg || "" ,
                defaultInput : cfg.defaultInput  || "" ,
                inputType : cfg.inputType || "text" ,
                autofocus : cfg.autofocus || false ,
                yes : cfg.yes || function () { Elem.close( mark.mid ) } ,
                cancel : cfg.cancel || function () { Elem.close( mark.mid ) }
            };

            var promptElement = this("<div style='position:absolute; height: auto; width: 70%; padding: 10px; background-color: rgba(0,0,0,0.7); border-radius: 5px; overflow: hidden; opacity: 0; filter: alpha(opacity=0);'>" +
                "                 <h3 style='width: 100%; height: 18px; line-height: 18px; font-size: 16px; color: #fff; text-align: center;'>"+ opts.title +"</h3>\n" +
                "                 <div style='width: 100%; height: auto;  background: none; line-height: normal; font-size: 14px; color: #fff; margin: 20px 0;'>\n" +
                "                     <p style='margin-bottom: 5px;'>"+ opts.msg +"</p>\n" +
                "                     <input type='"+ opts.inputType +"' value=\""+ opts.defaultInput +"\" style=' width: calc(100% - 10px); height: 24px; padding: 0 5px; color: #666; outline: none; border-radius: 2px; border: 1px solid #ccc; font-size: 14px; ' />\n" +
                "                 </div>\n" +
                "                 <div class=\"btns\" style='width: 100%; line-height: normal; background: none; height: auto; overflow: hidden; text-align: right; font-size: 14px;'>\n" +
                "                      <button style='padding: 5px 10px; outline: none; background: lavender; border:none; -webkit-appearance: none; border-radius: 3px; color: #000; ' type=\"button\">确认</button>\n" +
                "                      <button style='padding: 5px 10px; outline: none; background: antiquewhite; border:none; -webkit-appearance: none; border-radius: 3px; color: #000; margin-left: 5px;  ' type=\"button\">取消</button>\n" +
                "                 </div>" +
                "               </div>");

            mark.appendChild( promptElement );
            document.body.appendChild( mark );

            __elemList.push( mark );

            this.setStyles( promptElement , {
                "top" : ( MAXH - promptElement.offsetHeight ) / 2 - 30 ,
                "left" : ( MAXW - promptElement.offsetWidth ) / 2 ,
            });

            var input = Elem.getElByTagName( "input" ,  promptElement )[0];
            this._animate_( promptElement , { top : ( MAXH - promptElement.offsetHeight ) / 2 , opacity : 100  } ,function () {
                if( opts.autofocus ) input.focus();
            });

            var btns = this.getElByTagName( "button" ,  promptElement );
            btns[0].tapClick(function () {
                opts.yes.call( this , input.value , mark.mid );
            });
            btns[1].tapClick(function () {
                opts.cancel.call( this );
            });
            return __count;
        };
        //alert框
        Elem.alert = function ( cfg ) {
            var mark = this.createMark();
            __count += 1;
            mark.mid = __count;
            var opts = {
                title : cfg.title || "提示" ,
                msg : cfg.msg || "" ,
                timeOut : cfg.timeOut || false ,
                confirm : cfg.confirm || false ,
                yes : cfg.yes || function () { Elem.close( mark.mid ) } ,
                cancel : cfg.cancel || function () { Elem.close( mark.mid ) }
            };

            var alertElement = this("<div style='width: 70%; height: auto; line-height: normal; background: rgba(0,0,0,0.7); border-radius: 5px; padding: 10px;  margin: 0 auto; overflow: hidden; position: absolute; top:0; left:0; opacity: 0;'>" +
                                        "<h3 style='width: 100%; height: 18px; line-height: 18px; font-size: 16px; color: #fff; text-align: center;'>"+ opts.title +"</h3>" +
                                        "<div style='width: 100%; background: none; text-align: left;  line-height: normal; height: auto; font-size: 14px; color: #fff; margin: 20px 0;'>" + opts.msg + "</div>" +
                                        "<div style='width: 100%; line-height: normal;  background: none;  height: auto; overflow: hidden; text-align: right; font-size: 14px;'>" +
                                            "<button type='button' style='padding: 5px 10px; outline: none; background: lavender; border:none; -webkit-appearance: none; border-radius: 3px; color: #000;'>确定</button>" +
                ( opts.confirm ? "<button style='padding: 5px 10px; outline: none; background: antiquewhite; border:none; -webkit-appearance: none; border-radius: 3px; color: #000; margin-left: 5px; ' type='button'>取消</button>" : "" ) +
                                        "</div>" +
                                     "</div>");

            mark.appendChild( alertElement );
            document.body.appendChild( mark );
            __elemList.push( mark );

            this.setStyles( alertElement , {
                "top" : ( MAXH - alertElement.offsetHeight ) / 2 - 50 ,
                "left" : ( MAXW - alertElement.offsetWidth ) / 2 ,
            });

            var btns = this.getElByTagName( "button" ,  alertElement );
            this._animate_( alertElement , { top : ( MAXH - alertElement.offsetHeight ) / 2 , opacity : 100  }, function () {
                if( opts.timeOut ) {
                    var count = Math.floor( opts.timeOut / 1000 );
                    var time = Elem("<em style='font-style: normal; margin: 0 2px;'>("+ count +")</em>");
                    btns[0].appendChild( time );
                    var t = setInterval(function () {
                        count -= 1;
                        if( count < 1 ) {
                            clearInterval( t );
                            Elem.close( mark.mid );
                        }
                        time.innerHTML = "("+ count +")";
                    },1000);
                }
            });
            btns[0].tapClick(function () {
                opts.yes.call( this , true , mark.mid );
            });
            btns[1] && btns[1].tapClick(function () {
                opts.cancel.call( this );
            });
            return __count;
        };
        //消息提示
        Elem.msg = function ( msg , cfgs ) {
            var opts = Object.create( null ),
                type = "";
            if( typeof( cfgs ) != "undefined" ) {
                opts.ms = cfgs.ms || 2000;
                opts.type = cfgs.type || "msg";
            } else {
                opts.ms = 2000;
                opts.type = "msg";
            }

            switch( opts.type ) {
                case "succ" :
                    type = "<span style='background: url("+ icons.succ +") no-repeat; display: block; width: 25px; height: 25px; margin: 2px auto; background-size: 100% 100%;'></span>";
                    break;
                case "err" :
                    type = "<span style='background: url("+ icons.err +") no-repeat; display: block; width: 25px; height: 25px; margin: 2px auto; background-size: 100% 100%;'></span>";
                    break;
                case "info" :
                    type = "<span style='background: url("+ icons.info +") no-repeat; display: block; width: 25px; height: 25px; margin: 2px auto; background-size: 100% 100%;'></span>";
                    break;
                case "warn" :
                    type = "<span style='background: url("+ icons.warn +") no-repeat; display: block; width: 25px; height: 25px; margin: 2px auto; background-size: 100% 100%;'></span>";
                    break;
                // case "loading" :
                //     type = "<span style='background: url("+ icons.loading +") no-repeat; display: block; width: 25px; height: 25px; margin: 2px auto; background-size: 100% 100%;'></span>";
                //     break;
                default :
                    type = "";
            }
            if( this.msgElement ) {
                this.msgElement.style.setProperty("opacity" , "0");
                this.msgElement.style.setProperty("filter" , "alpha(opacity=0)");
                this.msgElement.innerHTML = type + "<p>"+ msg +"</p>";
            } else {
                this.msgElement = this("<div style='max-width: 80%; width: auto; height: auto; line-height: normal; position:absolute; text-align: center; background: rgba(0,0,0,0.7); color: #fff; border-radius:4px; padding:5px 8px; font-size:14px; opacity:0; filter:alpha(opacity=0)'>"+ type +"<p style='height:auto'>"+ msg +"</p></div>");
                global.document.body.appendChild( this.msgElement );
            }
            clearTimeout( this.msgElement.t );


            var width = ( MAXW - this.msgElement.offsetWidth ),
                height = ( MAXH - this.msgElement.offsetHeight );

            this.msgElement.style.setProperty("left", width / 2 + "px");
            this.msgElement.style.setProperty("top", height / 2 - 20 + "px");


            Elem._animate_( Elem.msgElement ,{ top : height / 2 , opacity : 100 },function () {
                if( opts.type !== "loading" ) {
                    Elem.msgElement.t = setTimeout(function () {
                        try{
                            clearTimeout( Elem.msgElement.t );
                            Elem.msgElement && document.body.removeChild( Elem.msgElement ) && delete Elem.msgElement;
                        } catch( e ){
                            console.info( e );
                        } finally {
                        }
                    }, opts.ms  );
                }
            });
        };
        //loading
        Elem.openLoading = function( msg , container ) {
            var con = container || document.body;
            var mark = this.createMark();
            __count += 1;
            mark.mid = __count;

            var loadingElement = this("<div style='max-width: 80%; height: auto; position:absolute; text-align: center; background: rgba(0,0,0,0.7); color: #fff; border-radius:4px; padding:5px 8px; font-size:14px; opacity:0; filter:alpha(opacity=0)'><span style='background: url("+ icons.loading +") no-repeat; display: block; width: 25px; height: 25px; margin: 2px auto; background-size: 100% 100%;'></span><p>"+ msg +"</p></div>");

            mark.appendChild( loadingElement );
            con.appendChild( mark );

            __elemList.push( mark );

            var width = ( con.clientWidth - loadingElement.offsetWidth ),
                height = ( con.clientHeight - loadingElement.offsetHeight );

            loadingElement.style.setProperty("left", width / 2 + "px");
            loadingElement.style.setProperty("top", height / 2 - 20 + "px");

            Elem._animate_( loadingElement ,{ top : height / 2 , opacity : 100 } );

            return __count;
        };
        //简单动画
        Elem._animate_ = function ( _el , json , callback) {
            var curr = {},times = 400;
            for( var attr in json ){
                curr[attr] = 0;
                switch( attr ) {
                    case "opacity" :
                        curr[attr] = Math.round( Elem.getStyle( _el , attr ) * 100 );
                        break;
                    default :
                        curr[attr] = parseInt( Elem.getStyle( _el , attr ) );
                }
            }
            var startTime = new Date().getTime();
            clearInterval( _el.AnimateId );

            _el.AnimateId = setInterval(function(){
                var changeTime = new Date().getTime();
                var t = times - Math.max( 0,startTime - changeTime + times );  //0到2000
                for( var attr in json ){
                    var value = (function(t, b, c, d){                          //减速曲线
                                    return -c *(t/=d)*(t-2) + b;
                                })( t , curr[attr] , json[attr] - curr[attr] , times );

                    switch( attr ) {
                        case "opacity" :
                            _el.style[attr] = value / 100;
                            _el.style.filter = "alpha(opacity="+ value + ")";
                            break;
                        default :
                            _el.style[attr] = value + 'px';
                    }
                }
                if( t == times ){
                    clearInterval( _el.AnimateId );
                    typeof callback === "function" && callback.call( _el );
                }
            },13);
        };
        //获取样式信息
        Elem.getStyle = function ( obj , attr ) {
            return global.getComputedStyle ? global.getComputedStyle( obj , false )[attr] : obj.currentStyle[attr];
        };
        Elem.setStyles = function() {
            var el = arguments[0];
            var px = "";
            //styles 为json格式
            if( arguments.length == 2 ) {
                if( arguments[1] instanceof Object ) {
                    for( var sty in arguments[1] ) {
                        px = typeof( arguments[1][sty] ) === "number" && sty != "z-index" && sty != "opacity" ? "px" : "";
                        el["style"][sty] = arguments[1][sty] + px;
                    }
                }
                //styles为2个字符窜
            } else if ( arguments.length == 3  ) {
                px = typeof( arguments[2] ) === "number" && arguments[2] != "z-index" && arguments[2] != "opacity" ? "px" : "";
                el["style"][arguments[1]] = arguments[2] + px;
            }
        };
        global.Elem = Elem;

        Object.defineProperty( HTMLElement.prototype , "tapClick" , {
            value : function ( fn , bol ) {

                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    if( this.addEventListener ) {
                        var d,x,y,ori;
                        this.addEventListener("touchstart",function ( e ) {
                            var evt = e || event;
                            d = Date.now();
                            x = evt.changedTouches[0].pageX;
                            y = evt.changedTouches[0].pageY;
                            ori = evt.target;

                            if( bol != undefined ) {
                                evt.stopPropagation ? evt.stopPropagation() : evt.cancelable = true;
                            }
                        },{ passive : true });
                        this.addEventListener("touchend",function ( e ) {
                            var diff = Date.now() - d;
                            var evt = e || event;

                            if( bol != undefined ) {
                                evt.stopPropagation ? evt.stopPropagation() : evt.cancelable = true;
                            }

                            //x轴移动小于5px  y轴移动小于5px  对比时间小于200ms  同一个目标对象
                            if( evt.changedTouches[0].pageX - x < 5 && evt.changedTouches[0].pageY - y < 5 && diff < 200 && evt.target == ori ) {
                                fn.call( this , evt );
                            }
                        },{ passive : true });
                    }
                } else {
                    this.onclick = fn;
                }
            } ,
            enumerable : false ,
            writable : false ,
            configurable : false
        });
    } else {
        console.error("Elem 命名冲突，请检查");
    }
})( window );

