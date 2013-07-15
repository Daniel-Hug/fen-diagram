function fenDiagram(fenNotation, theme, img) {
    "use strict";
    var gfx, TURN_NONE, TURN_WHITE, TURN_BLACK;
    TURN_NONE = 0;
    TURN_WHITE = 1;
    TURN_BLACK = 2;
    function boardGfx(themeUrl, succ) {
        var theme, images, IMAGE_BACKGROUND, IMAGE_BOARD, IMAGE_TURN_WHITE, IMAGE_TURN_BLACK, DEFAULT_THEME;
        images = [];
        IMAGE_BACKGROUND = 0;
        IMAGE_BOARD = 13;
        IMAGE_TURN_WHITE = 14;
        IMAGE_TURN_BLACK = 15;
        DEFAULT_THEME = {
            "height": 500,
            "images": [
                "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",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAADGklEQVR42u2aMUiUcRjGE3JIagmiIKzNJZoVSTCOW2xw0KGhbsmhXIKDWhpaJRpEmqRBCBWcblPMGhwzVLAl4eg67jhKPDnU6NK7t+c3GAd9fejl9/n95Xvgh3zv+7zvy8Md6B2eMbNTSxwuDheHO2XhpBZxSzwWrwQ/e6g7HU5qF2+FiZooCn4adfpOhpOuibLYmJqasu3tbUM7Ozs2PT2N4Tt9fE6Fk1rEe4IVCgXzUrFYPAj4Dr9L4RLCJicnzUcHryAkXAr3VNR4C/ppd3fX8OF3KdxrUbBDCB9+l8I9E/VyuWx+oo8Pv0vh7gibnZ01P9HHh9+lcGfFWjKZtHq9bl6iTh8fftd+z90WNjo6al6iTh+fM7/npFbxQHwW1aGhob9ePZ6p08eHn7lIh5PaxQexl06nrVQqmZ/o48PPHPORDCddESXxZXV11Y4i/JrLMc+eKIbLiK1sNmvNiDnm2ROpcNI58au/v9+Wlpaahnn2sC9K4TqEHSMdUQrXJpL/YGNwcNDm5+f/MDAwYNR9Ztpc+ST+bWRkxBrFM3XXP4m3itrExIQ1imfq9F0Od13Y3NycNYpn6vRdDtcjbH193RrFM3X6Lod7Lr6ah6jTdzncR/6G9BJ1+k6Gk64Km5mZMQ9Rx1TH52K4tKhubm6al6jTx+dUOKlV5FOplPmJPj78LoVLCVtZWTE/0ceH34lwUotY6+3ttcMIH37mXAh3V1gmk7HDCB9+5iIdTrogit3d3Q1fLfgLH37mmI9yuJeitry8bEcRfuaYj2Q46YbYGx4etmbEHPPsiUw46by4Jz6JDb5FbkbMMS/Yc5+9JxZOuijeiB+i2tfXZwsLC/Y/Yp497GMv+7kTajjppsiKrfHxcatUKnacYh972c8d7oUSTrokKl1dXZbL5SxIsb+zs9O4x90wwo2Jn/l83sIQd7jH3UDDSZdFlW+JwxT3uMv9IMMlhS0uLlqY4h53uR9kuEfCGt6SYb414WGQ4V6IvWq1avv7+6HBPe5yP8hwY8JOkLEgwyXEkxMkEf9jWxwuDheHi8MdN78BaX81Qu+YZAgAAAAASUVORK5CYII=",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAACpElEQVR42u2az4sSYRjHM2/SITrJeuhUJ1sEMxQiNkhYFgNFCAn0JIQIbZB58aD4Bwh5iT0k7GFPXTxI3jwI1VLSIaJlS7JDu1oia/6q1fTp+4IDsjhzceadId4vfC7jw/POR+Vh3pk5R0T/LUJOyAk5g8shd0FchrUl9fdlau8sqXUo9L7BQ64MSIZbS+o/ydTuLql9rNA7y0vuXa/XI4lSqaQoFwqFaLEex74pyR0fH5+tn/KU26eFVCoVRblwOEyLwbGvSnL9fp8WIuR4yO2Dl2foy8h9X1J7YDi5Wq3GPngrRzqdpsX4/X7F+tFopLOcthFyWskdFotF4gXWm/GSewFIB5I85CwgD2ZgkMvlqFqtqs729rb0dxyCh8DE7cIZ2QAN8DeZTBKbcGqk1WpRMBiUfq1X4IouuwLkAtgBZLPZyOVyrQx6nYA/4Ak4r/uWB3ljtVopEAiszFwsb5j9HPLa5/OpNfZb4KmQE3JCTsgJOSEn5DjJeb1eajabK4NeP40mVwOkIs8MIYc8AhSPx6lQKKzM1tYWa3oKbusqh9wDs2g0SmqFbZ3cbjdr/gus6yKHbIBT9k1PJhNSM+12my3wGRyBy1zlkHXQdTqdNBgMSIvU63W20A9wAC5xkWMLgSMwS6VSlM/nNSMSiUgDpspLzg6IM7+5yu3t7VGn09GcRCLBVe4BoHK5TDySzWalu2DXNZVDfGDCnrdNp1PikW63Sw6HQ7pyuaqJHHITjDY3N2k8HhPPsNt9WPsLaIA1VeWQa+DE4/HQcDgkPdJoNGg+pT+Ai2rKvTeZTBSLxQjjXy+kW3+MvJpyh2azmSwWi95ID0WeqyrHhogRgnOpCzkhN5ez2+2UyWR0B+fSUVvuIxgbiB3xYpuQE3JCTsipxT+53LslZ1L5FgAAAABJRU5ErkJggg==",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAE70lEQVR42u2aa0hkZRjH291226LLwrLERh+iNlj6shVbxH6oLy0EGV4QNBBE3EZEpXUVycTVPkyi4AUUBbUQwQviLQpHSW1CVktzvayaiizb6CjecBp3S53L0/8Zzgsv24iM52Jj84cfenyHc+bnec/zXmaeIKJjS0guJPd/kkOugjNBKYc8CyrAU/u0fwcmwOvBKPccIDAGXvXT/ofSPg/OBasccw+cldouAMrKyuKDP0FXsMmdA5ScnMwHD0Gl1JYCaGFhgdrb28U/4LNgkrsIqK6ujpqbm4VAlHJH7wKn1+slTlRUFLc5wEvBIncFUFtbG3Hw+wogiTukxG63i+75PXg+GOTiAI2Pjwu5nxSpB4AKCwtJTk1NjZD2glnQANLB++Dsf02uC6zu7e1RZmamr+uNjo5SUVGR7y6trKzQ4+ns7KSMjAxutwInIIUtUAHeOnI55Brw5ubmEmd9fZ1E1tbWaHh4mA4KP4+zs7NUVlbGJ5yWRO+CG+Ck4XLICeUN2Le3t0mrDAwMUFxcHF9gR5EcBG8YLRcnqqQemZ6e5ov8pgjugtvgtFFy98E9j8dDesXlclFeXh5fzKVIdoEzusohlwBVV1eTEenv75e7aTt4Uk+5j8G/CkZ3dzelpKRQUlKSr1BomZaWFjF8EGgEJ/WS+xL4KiLH6XRSWFgYN/h+2mw20iOlpaXy5OCWXnI/gxlSEhsbS+KiZrOZ9ExERIQ8Jp7XUk6sAvbS0tJIBMcWHpSbmppod3eX9MzExITcPcu1lssC7snJSZIHbD42KtHR0eLuucBlTeSQV8AjLhpHmampKX4zHkWwUrUccgoMAJvD4aAjjpiXElgCJ9TK3QbU09NDasOT6ezsbFITFC65cr5zaDnkbeDm8UuLmEwmKikpITUZGRmR5cyBysndcRTc12KCzItarnZ9fX2kJpj28XnWFbmpw8rdAl6r1UpqsrOzQ7w0EmV8ZmaG1EYeX8GLAckhL4OH2PxRNS7l5OSI7QePWJyOjY2R2lRUVMhyHwQqdxP8vbW1RZylpSU6KKurq9TY2EgJCQnElRUQeATqwJvADGhoaIjUxmKxyHKmQOV6GPFf2q8IiFV4TEyMPHt4AL4BEeAZ6ZyfaCU3NzcnyxUHKreYmpoqxpUh0E1+4na7RTuBarHz7A8kFZDYW1H5HMuD+Q+ByjUDKyFVVVW+u8fZ3NzkRktDQwNxuBsqF0ijg8dLK1gmbSJ3/flA5W4Az+NdKDEx0SdTWVkpLvAj2DxoEYmEASooKNBjpuICpwKRexr8AuYXFxeJMzg4KJ4rB8Y93goQ2+jfHiD2LtgGU7z+0yrx8fHyc/dCoOPcBbAA7MXFxfyH34Gvm3J6e3vFia/vt0smqi6wIaRlsPSS5S4eZvr1GvhVOsnS8vKyb+0WHh7Ox3P+Jq/IedAFfMuUjY0N0jjiEyTBpUDl5DtgAptAVKkNQCDZz+vfAzbgrK+vJ72Sn58vy13RYiX+IfgC1IBP/bzmMvgLjPPHV3oGn0XIctd0/UwcOQ1GwQY/X3qnvLxclruut1wGoI6ODjIitbW1slyE3nKDYJH3LQ2ImEAIYvSSE9XRk56eTkaltbXVMLloA7ukWPwaJvc54FnMsZT7Snx74TjKlQOKjIzkLQBD4O1Go+S+BpNHyEehb+2F5EJyIbmQ3GH5B0CVHgv+n/S2AAAAAElFTkSuQmCC",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAQAAAAC0hrNAAADsUlEQVQYGe3BXWiVBQCA4XelRhNKCbFuorQfJIqKbkyjic3QnEqaRlmiRgmKme04DNGgi6kjcpUkKWOUU1MwDUyD6cRJpub829G1sjmd2o9NOXPb0Z19b8gYR+dcwvmOdOHzwC23pM0d5DCDLG6KfkQRkS1kknY7uPihO5wq8jFp1gdf97LAR+U4aXYvRmyTJSdIu4Oc3WnCVSIrSLts6pEGpIpHuAkGEyDn6MtN8BR1HFkj/7CbvqTZaC48Z716RI5Ty+OkUS7BWJttc1r2E2M4adGd5TjTVpNiZkuC6YSuN1sJFtvRJd8Q+YTbCNEDVHHpazsTOFfkW+4kJL04yoUtJu1ykn+YVChSTg9C0I1SGsq9UolY7ZWWiSwhBJ/ieq9WIlZ7tVyRHFJ0H5dGm1RmvvlOEN8333x/tV2LRImSovdwj0lzRERExO9MKpaAe0jJFzQkTGoxbtxi8bBx47aadFJkFClZRdRrlIjVdtQkMouULKIxsKMSsdqOKkXGkZIxWGZHZ91tsx0VSCv3k5JunBrmjWiUOjaRslG4wKS4tf7kD+7ztAnbtZojMR4mBPNwvD9a5NtyiFZERCQ+0NmutVR20cxoQjIFkYBDM13qOrdbYamrLHSy1CAS41lCk4lv+bftKpzmKdvVOEiihCgTx9hom7XSgpw7bJs6qSRKiDIRC20T+JlEN9luokiUEGXieK+nUSqJEqJMXGiVxc5yki/7goN80XFOMc91nvQViRKiTCSBBPxOxSCzfcmhDpQDnEEkQZQQdWc/cnKhURts1+p5d/muxJAiQnU771BKEyIJ6jlFjACRs6xnOGnRg+38udTXxLkukgQFZBCKu3iQfvTiSnMJNqvzxI3qRxJnBEkZ9OEh+pLBDevNHEppRkQkxkE2sII1/ELrci8bLxaogdMkYA8rKWIzVTQjIhc5xveMJIP/MI1zJCid7+d+40oLnO5IOcAJ9k/0Zy+LyRnqs2yz0RyJcpy9Y51toastcYl5UoFUMpgu5OIE/7Jrs6SREVhi147KPmI8w3X05+Jku9bkAkmwGCijvsjArjRJBXVk0Kk8Wo6ZMGG146SGara96QcudYPlbnO5eVKLFJIB9KQU2Tvfryy3zHUuMddXZSc1VM2w3oQJV4s8TaeWISIitaygmK38RhwREUmwnizadWMCOxEREWngCJv5kpWcR0REptKpYUSIECFChAEk9eFJhjKE/vTgWj0ZQDbP8xh3kzSECBEiRIjwBLfc8j/3LwEjoKhOb9LaAAAAAElFTkSuQmCC",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAQAAAAC0hrNAAAFP0lEQVQYGe3Be2zUhQHA8W+pENA555ybxMU9EqLRJZuJYdmUwGSCaFwIGSCiItPVbGQypDEhECBMx8Z4ie5hKFvFGsEHQeDG1Kl0gQ1qBaFQWqrApK3lWqT03bvf3Xe7XS6/XuugPXX/jM8Hzvt/Mow5/I67+J/IZxfSjKzgE/YdSniXlQwlNAZXGXiPBAwjdAUb+Cd/4Vpy9E3iVE+UgMcJ3YwRdbHE+Ayhv9N6p0Sp5WJysoBknTpFagkNponmCRJjO6Hh+Bt1i8h4cjILX/KUvMNb9PRlSpG1XEhoKN3TbHe+yEj6YTwv8Dw3E7qYGiROnB+QbTUynWyPInFkKz3NZAvFXEcvtyJRGkkyhtAlPEwTR8kn2z+QNWS7koAKfkQ+obnIMTpo4atk2UR9p63SRAnZdiP30NMQupDdZFuDrCFb9RiTVkqSeWTZRF2X7dLIerK9glQxiNANyD66GEJoOJ3IL8h2+HsmPSxJ5pFlPEkaOEmc0WR7HpG7CM3CIpGRhFYhUki2QuQ92jnDV+jl+2zgJB9yDdnW0kw1lQwiYz3HoyI/I+NLdFCGPEC2cSQ5wjqu4SPNRN7nKnpaQXy9yFQyqierHKOEjOUEz4hMpqcbaUe+wX81lFNINZcTWogtcoSD5JFyKcnl6lSpIe1y2u/2VZFxhK6nGdnBWS1DZC+fJWM21rte5IekjMe/qStELiPl1wRVvijybTKuJorIZM7qayQoJUYpw0i7D6sM5Aj7yQMWErSrO0UmAF+gbbr6R5GrSbuK96mjkjou4By2cfw5SbCVC0iZhHvUp0UmAdt4x3/rkDiLgKUkDqurRa4g5YscoWmrJFjEOd2Kmy0SKSEPGIuvqYHUsI88GgtMYy9/5vO0TDNlicgw4BL20VLmIxJjOOeUR80t6gqRJ4Eb8EVTikXmYJFpD0oTj5GoNKVQuoEL2UnnG3ZKExvol4dJVqkLRZYwAteZEkgNXXjAtHUiXVNNK5Aog9lOfItaLDKKfrmU9odMeUhkKa4yrVikNWHaQZHEIdPulKNsJFliCmXsp9/W0tymJp0h4mLT4vLuaDMS0jLFjAki/taUMpEC+u1b+AdTAieJc8z4k48YGmuFGTeKj5l2nzRzEQOwkwP+R7e3eL8Zcd8ytNsQBwpNa5JOVjEg07DUtDZXem6PmrFMkoxgQIbQMMW+Tlppma8bcYflVtlsbwl5j1cYsCXE6k1r8yUL/K58iIiIiIjUjXWubxo3LSJyBwN2JcFidY8TpRPppuynPumzRtzlPkt92add6Qw5RAI59aDH1NvkOIPIQZT620Xafuwuuw21uMHAUIvbnCgBsbslQYScRJHYMs+YbbOcQMrfNlutPxGRCDmJ0lhqb4tERCTYbG9rJUaEnEQL7KvbuZJE2p+yr6S8TYScRHG6Dfb1V2+zyr4qvEkkQk6iiK/af78UkQg5ieJMQwnrLfdlf+8CZ7nEIre73yaTZsRlLxIhJ1HqT5tSYaEcJY6IJDnNCVoQEeli/6+sNWWvxImQk+hsG10j5UjHaOe73WobDUyL+YGHfMHZUk5AYpzP2iG7iJCTKA3EaH3AHcY8u1Y3OVECznCGCDmJYoGN9l+1Y0Ui5CR6uwMVl1oi5KSamkYHpkK6eIaczEJOPGGr/fOB86WVbkaRo3tpQDrv8An32O1Ha/ENl3qTJJAKRvExXMS9vEYnIl3sKXCBqy1xs8Uud54z5CAJRE6zkQnk8wkYzEh+zkZqOE0SEREJaKKCIu7nWvL4VORzGSO4nq/zOfI477xPx78AKZtRyTDUuEMAAAAASUVORK5CYII=",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAQAAAAC0hrNAAAEF0lEQVQYGe3BXWgUBADA8b9KEhWk9FC9mdSLD0EPqaWiZEkmkhbUTFLEnPhdrB5COU00NUWkE0KTLExK/Eg7Dz+KUkLMvM1sapuTEl3T3eaG29zd7m73Dxmy5nZ38/Le/P3gnnsKYDZBggQJEiRIkCBBXqZgQojUUkMNNTQgEqBgQsSxyJTaIGXEkQAFEyKyViwyKmXEDogEKJgQEV0r0kTsoGmRAAUTIqINchnHmjItEqBgQkQaJUJspviWSZEABROi8lmJHVTXilNFAhRMCHG2u93tbseKSICCCSEiIiIiAe6C/gzhdSbzJH3p9CiDmEotIlLOCwxiAJ368zRFTGAwfem15zlOEhGRG5xkBffTYQ3p8R72gjvlD27wNh0eYwtnSSIi0sp3PEFOA9lKmspV7vGMpX7uHDlBO38yDJiFH3hL0heljWFAEfW0jrHE7Z6z1G9cLPXEWEo/sgrRvN6EXf0sl0ixmfhIk3aqlRousQuHet6uGn1P0iwliwW4w540OkUkddGu9oikAibtSYmkGEEGDxGfaWbLxBL/K+kYSe83k4SUcYoMRuAvZpbyefGQnT4S55vNGknxAD1aQLrJbC5IMxUJO1yUVipazeaQyHB6tJ56c9gsbrBDkSRPml2FyBR6tBCvmQulVLepVdJebC7fiwynR+PwiLlsFLeoxeIJc1kpMpAePU6qxFwaJD7UG9LCGXN6Ti6S0Vbif5vLm+I6cZ257BKZS0aDSb5hLodEWknWml1cqrhEf7JYiQEza7bKI9KC/P6rF42bSZsTpZ3XyGETLrOrhAdc4kvSgIiIiIj8M9nVHrerhK+KFJNTX7bjDK/Z4ZyLJIq08dtcN7rdsMc85VH3+ZXrnS5naUfOr7DWDucdLVJCr/RhPi1Et9noQknSMstjttmpyW9N2anJ/U6SFNfX2+JyiVPNeO7AYI4gMRKfeN2u9splJFJqV9XOEYkhX/Awd6gP9dQd9XZLRUQktdfbbZYEh8hLtNju2iyRNHJjk92lpZQweYniVK/a3Y++YoXdlTtSJExeooiH7b2PRSRMXqI4w07t1hhxn5+5xHkud4sHPG29aW9JShkSJi9Rahq9qdz35S+SiEiaRi7ThIhInNOrrfamMkkSJi/RRdb5qUSQ1tEu9oCV1pmyQ8IrnnWniyRCivZxbrdVjhEmL1GukqD5HY+YMLtm9zhJUlznOmHyEsVi6+y9SseKhMlLdIJ3KinVhMlLJVV13plyibONvMxDLgdttneuuFiaaWMUeZrGVSQ20aAnbLNnTf7kKkdKO1LOKP6HB5nGD8QQiXOi2CVu8Gv3+qXr/NDpcoZ2RBrZwXj6cRfcx1DeZQdVNJJGRERS1FPOFmYyhD4URD8e4SmeYTAD6MM99xTGvx/hwU48RvKkAAAAAElFTkSuQmCC",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAABzElEQVR42u3aMUsCYRzH8Q66IclFiII421zEd5BDiJNvoKFaWmoKglwc3KVJGtt6A+5RLyDcrqWhJZAQIWgJVOzfd2gKLu/07p7nL/eDD8/8nR4eeNZEZGVlcVlcFrdicczBPi5w83tW4aiOYx7uIfjrHp7KOFbEB+QfHyiqimMOHiEhPMDRFFeDRFDTFNeMGNfUFHcbMe5WU1wrYlxLU1wjYlxDU9w6/JBhPta13XMHIeMO1NxzzMUpXkLGveAUrtVxzMMTZAFP8KyMYzt4hyzhHTs2xvUgMehZFcc2MIkpboINm+JKkBiVbIrLoR5gFBAwQj1ATstLfBgQN9T+EncxC4ibwdUctwf5x57muOqcuKrmuPacuLbmuP6cuL7KOLYLmeMbuxrjLiEhXKqKYy7eQsa9wdUUdwKJ4ERFHHPgR4zz4WiIO4Qs4NDqOJbHYMG4AfI2x11DlnBtZRwrY7pk3BRla+LYJo7wDInBM46xaSyOFXCHL0gCvnCHQqpxrIJXSApeUUkljm3hE5KiT2ylEdeFGNBNNI5tY2woboztJOPqEIPqScadG447SzKuYziuk2Rc13BcN8m4Gq4MqmUf27K4LC6Ly+Li9gOJgdKiudLTDgAAAABJRU5ErkJggg==",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAB30lEQVR42u3asUsCYRzG8WqMhnB0aTGnEoUIhAiDEIdCXEIC5xAhgqhBt/4AoVvCoaG5xan2oJLIhohEIW4oQVoy6yqNu1+PkA11t+R7713xe+CzvfTyHbo8aYCI/i2O4ziOc3kctggZC16T88sWZ+dNzgYhY2FaRtwhkIVZk/PXFmf3TM6uA1nY4jiO47gfSnDwzZPF2TuTsxU3xD3DmSyy40okcbhP5zhBcdVisUiy4D5DVtw+kAM2ZcQNgwKGpCgNVmFQ2gdnLAKqzWHHMO7IWwE2AgUbot5gA4Ycf+XBTgXHKa55n8NOBMdtcxzHcRzHcRzHcRzH9Qc7Fxy344o4bA1IsDbMORqHLYERj8cpn88Lg59ZhkcIOBKHRaAdjUap0+mQyDUaje4FN1CHMalxWACaUG61WmTHarVa96J7qIBHShzmgToY2WyWFEWxTSqV6v0OHsmKmwCS7JXjBMStAPn9fgqFQrbDXbegw5StcdgCvCeTSdJ1nWSs2WxSMBjsPVz8tsRhM/ASi8V+8ejv/0+Dz+cj3K+CV2gcNgkP4XCYNE0jJ6aqKn0+pS9hVGTcBRjpdJpyuZxjEonE11d/IuOqQC6yy3Ecx3F/N+4KOi5S4H9s4ziO4ziOE+UDmc9n6XfazEUAAAAASUVORK5CYII=",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAEXElEQVR42u3aX0hkZRgG8Gb/uEs07YJIbHgRsQtLIdvIlqKioKamhhKhBiuIrUlktE2YoDEQOF25iswoIq4muemNSShKF0oRbiK0MZpYexEWo5L2j9x116bx6TkwH7wMk+6ZOWdmp+aBH+p5D+KDc8535tOHAPxnJcolyv2fyjEXKSkuyzGPkJtO/Mv8U/LQuXgsZyXQN/RkiPmPBLpFp+O1nGaZTopZCkGYjrdypwlCr5i9QQjSEE/lzhCCvERWuhli9gc9Hi/lLhB0mqRH46HcJUKQ22lpaYcV3Kfv6Dq9Tbl08kErN00IuDs4OIi9vT3Y7fYDy2VmZqKsrEz73CuO/05ussW8HJNF+wRNaWkpBgYGUFVVBXE8pK2tLahsb29jYmICBQUF8pybdJmORL0cY1E3jDCtdHV1YX19HTJLS0uor6/X5vcIdIOeina5SwQD+PPy8jA1NQWZjY0NVFRUqHP2yEHHo1XuB4KRioqKsLKyApmRkRFttkugaUoytRxzlmASn3bdyszOzmrH7xDoEzpmZrkyQrDi4mK43W709fXBYrFEVNLhcEBmbm4OWnECfUxHzCrXSlCsVismJyehRfuYmpqqZhFpa2uDjNPplHO7WeW+ICijo6NQaW1tNfIluj8zMwMVv9+P3NxcuSYmG1qOsdJfBEX7ATo6OlBTU4OkpCSjr8EtuVwsLy/LNdRldLl3CVJKSgrU45YZGhsbIVNdXa1mPjpvSDnmCXXXirJ7m5ubUFldXdWO+QnUG3E55ih9SYiFlpYWyOTk5KiZlyyRlnMQYugX7Yai0t3dLWfPhl2OSae/CbG0uLgIFa/XK28sTr3l5Mvxa0Kstbe3QyY9PV3Nvg23nJ3wINAesGUaGhrk/DFd5ZhUuk0wiJ/+jOSuKa+7np4eOcvTW+6K/Ma0TQjDHfqQniEnIVxra2tQmZ+fl7PX9Jb7jEC7CwsL0PlbXKNrVEkPi+/5IiFc2jsElZ2dHXlTuaq33M+E8vJy+Hw+ZGRk3M8P0C93noMxTYRw9ff3Q0a8mqb0llsk0MbQ0JD2cZ1Av9ELdJ0gvHkf6+XnBi7mapcbdEtvufcIIbwamPeKY7/SsUOKlRMiUVdXB5nCwkL5nHlUT7lTtEkQviJLYLYjjg8eUuw5dX4ktJ01mdraWjk/pXedswXdvrMCx7sIwvMH7JJdobuESKjrX6a5uVnOz4Tz+PU0eeijwNfJQY9j3wc/vIrzpglGyc/PP+jd+dlwH5xPqO1uJoMgvB7i/Ez6iWAEuVMtwzfJcn7BiG2Gc3SVrtErIebnaZdgNJvNBhmXyyXnWTrK6cccN/NBOzs7GzLauieve7PLvUMwS0lJCWSGh4flvNLscjcIZgleCsbGxuS82rRyTDL5CWZpamqCzPj4eNTKvUwwU2dnZ8zKvUUwE/+OF7Ny7xPM5PF4YlbORTBTZWWltrOtiC0+88t9QEsxVJL4r71EuUS5RLlEuXD9Ax+Ky+yZpDFSAAAAAElFTkSuQmCC",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAYAAACo29JGAAAEAUlEQVR42u3af0jcdRzH8TQ3bYPakHH1j9imycgiNVRk4A2ZMMktQQl/gDr/KEykYJZBf/iXoClm/6Slh+AQQbL+MQU9DCdCIsQkL4WFtcx/OmZs2c7Ue/Xk6MZRd19PO7nvHfeGB8qX8/Tpfe/7/d7n7glJUSsWF4uLxUVhHJOIUjTBGjVxzHmsQD6mcCoa4uaw09bWprm5OTU0NHgDuyM6jjkHVVdXyztut1sZGRli+0+RHvcs1NLSIt+xWq1i+71o2C3vwDk/P6+9vT2NjIx4d8uBaIi7gvsQHkJYxQvRciq4BDeELVii5VSQhQ3Ix7ewRHQccx1/QH78jJciMo65CTdk4AGuRkwccwKfQ0Haw9umj2POwg4dQQ/iTRnHpGIV+h++xFOmimPO4AcokPz8fA0NDclisRwUeBsnTRHHJGAGMlJVVSUx6enpxnHAx2aJ+wQKaRxQGtY45jn8BfnDBbJaW1s9RkdHJaarq+vxtrS0NKO4lXDHvQsF0tHRIaMpLS01inMjOZxxnxrFJSQkKDEx0aO2tlZiMjMzH2+Lj483ihOuhTNuBDqW5xzwTjjjOo45rjycca9DwUhOTlZubq6SkpKCDdtHSjjjEvArdAwmzHCeuwYZcKWkpCgvL0/FxcXKzs4W2zaxd8CrhXSzXH59CEGEqL6+Xv39/VpeXtb+/r78jcvl0sLCgrq7u1VRUSGfpYhHuG62C+cbUG9vr2f5jjDP942NjSovL1dhYaGysrJUVFSkyspKNTc3y2azaX19XWJqamq8j1iBGV8VnIL3aPgb5Isw9fX1yd9zNDU11bOreq9KTBtXUFAgvm5DXux22t3dlZitrS3PifxfgRtwmD6us7NT7HL/Oaw3NTVpZWVFJSUlPtuB4eFhzz/A9HE5OTlHOexvR8QjBzdW6+rq1NPT43mBOj4+runpabHqrKmpKY2NjWlwcFBcWHsONtz+F8j0ce3t7fLO5uamHA6HFhcXZbfbNTExodnZWS0tLWltbU1Op1PeKSsrM3XcCXyH25iEEwrCPXyBVdjMvPr1JN7EDP6EguDEOK5G0qLsSXwDGfgIcaZZlGWexvM4jzMGt/sAOoALJQF+Pg7nkAYL4kIex5zFe5jBowAXuXfwFQYwijUoSG4s4hZsmMSqn9+1gx/xNV4LJvagsLewBYXIfShEvselI8UxN6EQ2kYJFEIP8Oqh4pgL2IFCqPOf+56FQmgDcYeJex8KoV7vH8CcxgwUQtmHieszeMNwAEOw4y5cBm9NjcMaYHniDcxDATyEA5P4DLfwO+RHw2HiitHix0WDz5u8giJcxoVg38xgTuMirqAQL+KZALe9jBY/Xo59sC0WF4uLxcXijupvteDwPygc/CgAAAAASUVORK5CYII=",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAQAAAAC0hrNAAAEeElEQVRYw+2XbUxWZRjHf0Q60MzILJnNXjamM5cvla2a7wVSC5urQEuWWa6NucBszVXmtNZKjWLqSq054wPYKqehsVrLpcXMYYxSkYIiMAWUF0XgeR7Ovw8ejvc5z5M8nMf6ktf96fqf67p+55zrfjkHLtv/yRLJYyPz/xtYPPsRrYh1l7r0PRTyK++QYGjTUb5CWiBCJBr6CIr4gy8Z6xc2niBVj4gQ7xnqTFQiaaUIcJWhf8+ZLNFIPUP84V7BapD0uKg31AE008puAuwx1GS0RtJOIdL84XLQpzolfuJHl34jexGbGWRoCXTPU4deFmJyNMXT+ITtzDSUIVQjggTJ8MS+i3jCo72OCCJ2udSF7GQrt3lhsxGNNGEx3VCHspRmaoj3RP+AKPBoIwlRydOu2BcQtZyjnZvdwZ9xvFNnRDOFnjJliAUuZSBdiDJPXEGEW6iaLkuHhcVyL66hSx2iiW2elFLEUa4wlDsRoouBhpZMJ2K1J/fIDFk6EgGXhsUJThJkmidlO0KuPSQH4Z0S+QixzJO7DPEbHbRxk7d791PESU4zxqNvRojDxvNts3FLHOUGziHEM57cVCyO8WFYTdsWIuoY5dLW2cUzL3TEVi50ea2tPObKvI8OxDj+0RI4hahiuKGtsEv9TBwASVi2Um1HDKfDVlKNvIm0Ir7lovY2QpRztaM8b5cSj9pdljOGAfCW49/tZI2mMcLzhtkt9CDEXmf7fcopVkGc8bRCpAPXcdbxR9s5o6hDiAaupA/7wk7dZYfONcrPNa4L8RrwpuGPAOB6jhnX+7DZTnIhccAso9wh4mgy/N1cS7vhJwJDOWR7AZL7xsVR7aSvp3dR9448l9fMG4bXDQxin+MX9Q0DWGqUWEWKC9Dl8tx+IwPYY/hTosMlORNbyNWbi48aig2vIjoY9O4ksY3F0eMmxAxrZXD0OIyG+xv5/YHBvJhgFin9ww3kRKRCIzRGd2mG0jVNk5SipMi40v7BAFYZ6Wey9IH2q1Xh9pe+Vr7SRMCIf7j/uJGEEJqiHeqU1K0D2qAczdeDulcTNFUZylaetuoX9Ug6rS2yN4jfXWd/1NZI7eeSzmqT2E+3cfftmTp/M73+Q9qhkAIqEG2U+IFBY64CelG0uTszR39KOqhJ3o7Vb5TEPt+4JzU1bBqsdLoW0pywq8+KA75xrs3M2YjXypLUocWRl0BnDC+zUJEWxCyViKPh+jh9F8vLzJX0QD+W9/LYeperj8xyPRy/Qxl6Tqu1Xiu0SOm6XTQ5n0oiWB4LLlO0nH9Ja1SjoD1FAmpWnVrUY/tdqtBLoh4hyinzP1UsmpbooKQ27dBKzVWKjOlj0T5eC7RG3yigHpVqvjiH5RuXpYBatUGpci3yiAdOlooVVJuo9I3L1qv264xy1L4f07rzd/z4xFX5xH3sD5fjC9Yd7RdYuGVHPmQvMir9wwAGk81XdEYBaqGY9LC/eF82gMnkUkw1LcYeIkI0U8kWFjHW/h275BbPMFKYyK1c828hLttl429f16B/CGm7qgAAAABJRU5ErkJggg==",
                "iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAQAAAAC0hrNAAAEeklEQVRYw+2Xb0xVdRjHv+hyrdrS9aJ6Z6zW5lpbbmFpLldpsaYO2wJr0ByL1NQsbK0sJNOZk7latqURTIkI80+rWKNasiw1RIQAlT8FA2KBVy5cuH/PvefTi3uhS5x7rx66veL5vrrnnOf5nN/v99zneY40bdOWBHtBH0zSE8nDfa2A+hQUQsirPqGCZOKaoQIFha7U4yHZOLYAFWigHi+PJx8XBrrGYMnHabAH+IHIGSYZ56zDSzFQjkLJxo3URrZxC3Ao6av7/SjLwmfGeo78L2c3Uf8Jbpbm6Sll6E7NiLp6q+bqWfVHQE16RHM1e4LXvcrSk0qd4JXAFuq0jPG3d+usduj6yL3dMtP5jg6+QL/JrezI9dtUrJYoL4+O647EqDkqlanWXRyjmXN8zDrSUEgXtUDS8+JVoI/DjGDwGPJrgaQsOeRZQj7lXOAcFWxFDnm1TTMT5t5eArg4TRlH6ALgBOpWUAfkewiDEmQIuWrpR33q1hGRRhsQooUyDlOPHycvI1Pb4sE2ikr87ELO8W25vJFRnKxGKNiFC7nDd+YDxxAKFmDQQwYaHffqLAfyUVCLYsFuki8XWD85+zp+AgoR+eEgCPE5BkuQ+Q1wMPoFIyolgOp1PhZukTjJL8hKoc8IshBRjQe1iQzgbcQGYIu1j3uI3SioG2Jtpelij7UrGrlIBxrRpQDlyGylC3l0ycPRWB7UUI3QA9a4vXLAhpjOanZzAPEefrKBLGScpQMNxfI4yCWEVlvjNokrvB8bxyuAzqnXj5d2FMoDFsd5/hRfxVndMlHDiTjuGnKzD1EM5CF+pSHe08FhdiI0xxp3u4L5hFBj7BCfMIh8abjRqJphbRzcGuBB1BX7f1cqXydVcULcD2QiihBFuJAr5rPe7nDHWB8blyrjaWCddQBDLZkMhbPNI6OfRpajTpnW++BD7erWrHh1ZacoIBSuIWMKPMchzuMDRminJlw9Gs7QhQ9wcYr9Y5NLREX4WY5CWpWoSO8XhRhsR34h/1o6CfAtb7IUDVqs488M3uU0UMsKZAo5ygmwEqG8xD1hhsrFGq7QzFZ6ucBLaEAkVNsO+mngDQZo42GE8q+u36Vog0Y1UIaTTUT1sH/kymR8lo7W8F5G2Y586lX6tXTzVNUIea3WsZIeoI75MTJSqEQ3X+v4kCKHVbhCxiwYPp/JqrY3rwyMdbYJ8hdhAm7yrFCmvKqyidvMp+ivyUEfpYq7LWD3cBL9PAUcLEVXrddhariSCS1WfapbwVreYR8F5JKOGnU5qqoY9VPBZY6NBE17+AMjkiIBHHTjJBT57aOR11CvEKrXGds4mbq8kTpgmC8pZBVqi0ofUy41ZLOHHwkQoppnkEembVwWAYb4kGXhgha3E2ZRicEwarKNy+Etiwkrjjo/QrX2NxNbsolrtYkrs4d70RbMr8WyaTlWNSWumuzDJOlG5eh7687wLzlVqfREXzxXZ9cpTZtVqXY5J0wmQTnUpGLlap5SlBSbqVt0l+5TqmYnCzFt06a/ASH2p5LAlLkeAAAAAElFTkSuQmCC",
                "iVBORw0KGgoAAAANSUhEUgAAAbgAAAG4AQMAAAANBGDwAAAABlBMVEX/zp7Ri0f2nRiaAAAAlUlEQVR4Xu3ZMQ2DAABFQQgDYyVUSqVRaZWCBEYGQpvwTJTk/vaGU/CHNn6vHdVcbdWz+lRLdWPHcRzHcRzHcVzgDEzVXj2qtXpV7+q+juM4juM4juM4f8D/O47jOI7jOI7zB3Acx3Ecx3Ec5w/gOI7jOI7jOM4fwHEcx3Ecx3GcP4DjOI7jOI7jOH8Ax3Ecx3Ecx3E/fC0XfmqTndwAAAAASUVORK5CYII=",
                "iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAQlBMVEX///8AAAAAAAAAAAALCwsPDw8AAAATExMJCQkgICAAAAAaGhoAAADb29tUVFT///+kpKTX19dQUFDx8fGJiYnY2NiVUfSTAAAADXRSTlMAYMvZ/hF5/hsIr/yu1RxrpAAAAHlJREFUeF51kUkSgDAIBCGrSSSr/v+r7qVlQh/7AAMDFxq9VEp61PDijI25tFZytMY9dhKV0g1VMd02LOnDEk7vxGVfL445pqYf1QBoS39NVgPG1BERfO519iDXXhcJqvW6KUYzQ8YrZyYgcw5zPPMq9rF9DXxpTMUbg7MVwxa77VAAAAAASUVORK5CYII=",
                "iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAlklEQVR42rXVsQ3DIBBG4StpXXs51mCpMIgnYBfrLq+4goIkisWP9JV+si04LCKWWAcqOgY8DXRUHJ+eXwULGhzxg6OhfA2zTlyIP104l+GM3oiH7jk+f36+6XPZKHO4ITZp2bQDvjHs2bSK2KzCuiDcYUMQHjAXhF0Wlv6KLgi/ZNtNdkAkR1o2hCRjUzXo9VeT7DJ9A4HeRNacLTPqAAAAAElFTkSuQmCC"
            ],
            "squares": {
                "height": 55,
                "width": 55,
                "x": 48,
                "y": 13
            },
            "turn": {
                "x": 14,
                "y": 465
            },
            "width": 500
        };
        function getJSON(url, succ, fail) {
            var http;
            http = new XMLHttpRequest();
            http.open("GET", url, true);
            http.onreadystatechange = function () {
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        succ(JSON.parse(http.responseText));
                    } else {
                        fail(http);
                    }
                }
            };
            http.send();
        }
        function loadImages(rawJsonArray, callback, i) {
            i = i || 0;
            if (images.length === rawJsonArray.length) {
                callback(images);
            } else {
                images[i] = document.createElement("img");
                images[i].addEventListener("load", function () {
                    loadImages(rawJsonArray, callback, i + 1, images);
                }, false);
                images[i].setAttribute("src", "data:image/png;base64," + rawJsonArray[i]);
            }
        }
        function drawPiece(ctx, value, squares, x, y) {
            ctx.drawImage(images[value], squares.x + squares.width * x, squares.y + squares.height * (7 - y));
        }
        if (themeUrl !== undefined) {
            getJSON(themeUrl, function (jsonResponse) {
                theme = jsonResponse;
                loadImages(theme.images, function (convertedImages) {
                    images = convertedImages;
                    succ();
                });
            }, function () {
                throw ("Unable to fetch " + themeUrl);
            });
        } else {
            theme = DEFAULT_THEME;
            loadImages(theme.images, function (convertedImages) {
                images = convertedImages;
                succ();
            });
        }
        function update(canvas, board, turn) {
            var ctx, i;
            ctx = canvas.getContext("2d");
            ctx.drawImage(images[IMAGE_BACKGROUND], 0, 0);
            ctx.drawImage(images[IMAGE_BOARD], theme.squares.x, theme.squares.y);
            for (i = 0; i < 64; ++i) {
                if (board.positions[i]) {
                    drawPiece(ctx, board.positions[i], theme.squares, i % 8, Math.floor(i / 8));
                }
            }
            switch (turn) {
            case TURN_NONE:
                break;
            case TURN_WHITE:
                ctx.drawImage(images[IMAGE_TURN_WHITE], theme.turn.x, theme.turn.y);
                break;
            case TURN_BLACK:
                ctx.drawImage(images[IMAGE_TURN_BLACK], theme.turn.x, theme.turn.y);
                break;
            }
        }
        return {
            "getWidth": function () {
                return theme.width;
            },
            "getHeight": function () {
                return theme.height;
            },
            "update": update
        };
    }
    function boardState() {
        var b, PIECE_VALUE;
        b = [];
        PIECE_VALUE = { "SPACE": 0, "PAWN_WHITE": 1, "ROOK_WHITE": 2, "KNIGHT_WHITE": 3, "BISHOP_WHITE": 4, "QUEEN_WHITE": 5, "KING_WHITE": 6, "PAWN_BLACK": 7, "ROOK_BLACK": 8, "KNIGHT_BLACK": 9, "BISHOP_BLACK": 10, "QUEEN_BLACK": 11, "KING_BLACK": 12 };
        function wipeBoard() {
            var i;
            for (i = 0; i < 64; ++i) {
                b[i] = PIECE_VALUE.space;
            }
        }
        function place(value, x, y) {
            if (x > 7) {
                throw ("A playing piece is placed past the end of a rank.");
            }
            if (y > 7) {
                throw ("A playing piece is placed past the end of a file.");
            }
            b[y * 8 + x] = value;
        }
        wipeBoard();
        return {
            "remove": function (x, y) {
                place(PIECE_VALUE.SPACE, x, y);
            },
            "whitePawn": function (x, y) {
                place(PIECE_VALUE.PAWN_WHITE, x, y);
            },
            "whiteRook": function (x, y) {
                place(PIECE_VALUE.ROOK_WHITE, x, y);
            },
            "whiteKnight": function (x, y) {
                place(PIECE_VALUE.KNIGHT_WHITE, x, y);
            },
            "whiteBishop": function (x, y) {
                place(PIECE_VALUE.BISHOP_WHITE, x, y);
            },
            "whiteQueen": function (x, y) {
                place(PIECE_VALUE.QUEEN_WHITE, x, y);
            },
            "whiteKing": function (x, y) {
                place(PIECE_VALUE.KING_WHITE, x, y);
            },
            "blackPawn": function (x, y) {
                place(PIECE_VALUE.PAWN_BLACK, x, y);
            },
            "blackRook": function (x, y) {
                place(PIECE_VALUE.ROOK_BLACK, x, y);
            },
            "blackKnight": function (x, y) {
                place(PIECE_VALUE.KNIGHT_BLACK, x, y);
            },
            "blackBishop": function (x, y) {
                place(PIECE_VALUE.BISHOP_BLACK, x, y);
            },
            "blackQueen": function (x, y) {
                place(PIECE_VALUE.QUEEN_BLACK, x, y);
            },
            "blackKing": function (x, y) {
                place(PIECE_VALUE.KING_BLACK, x, y);
            },
            "positions": b
        };
    }
    function fen(text) {
        var i, j, x, y, board, turn;
        x = 0;
        y = 7;
        board = boardState();
        try {
            for (i = 0; i < text.length; ++i) {
                switch (text.charAt(i)) {
                case "P":
                    board.whitePawn(x++, y);
                    break;
                case "R":
                    board.whiteRook(x++, y);
                    break;
                case "N":
                    board.whiteKnight(x++, y);
                    break;
                case "B":
                    board.whiteBishop(x++, y);
                    break;
                case "Q":
                    board.whiteQueen(x++, y);
                    break;
                case "K":
                    board.whiteKing(x++, y);
                    break;
                case "p":
                    board.blackPawn(x++, y);
                    break;
                case "r":
                    board.blackRook(x++, y);
                    break;
                case "n":
                    board.blackKnight(x++, y);
                    break;
                case "b":
                    board.blackBishop(x++, y);
                    break;
                case "q":
                    board.blackQueen(x++, y);
                    break;
                case "k":
                    board.blackKing(x++, y);
                    break;
                case "/":
                    if (x !== 8) {
                        throw ("Expected a piece designation.");
                    }
                    x = 0;
                    --y;
                    break;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                    for (j = parseInt(text.charAt(i), 10); j > 0; --j) {
                        board.remove(x++, y);
                    }
                    break;
                default:
                    throw ("Illegal character.");
                }
                if (x === 8 && y === 0) {
                    break;
                }
            }
            if (++i === text.length) {
                turn = TURN_NONE;
            } else {
                if (text.charAt(i) === " ") {
                    switch (text.charAt(++i)) {
                    case "w":
                    case "W":
                        turn = TURN_WHITE;
                        break;
                    case "b":
                    case "B":
                        turn = TURN_BLACK;
                        break;
                    default:
                        throw ("Expected either w, or b.");
                    }
                } else {
                    throw ("Expected a single space or the end of the notation.");
                }
            }
            return {
                "board": board,
                "turn": turn
            };
        } catch (err) {
            throw ("An error occured whilst attempting to parse " + fenNotation + " at column " + (i + 1) + " (" + fenNotation.charAt(i) + "): " + err);
        }
    }
    gfx = boardGfx(theme, function () {
        var canvas, state;
        canvas = document.createElement("canvas");
        canvas.setAttribute("width", gfx.getWidth());
        canvas.setAttribute("height", gfx.getHeight());
        state = fen(fenNotation);
        gfx.update(canvas, state.board, state.turn);
        img.setAttribute("src", canvas.toDataURL());
        if (img.getAttribute("title") === null) {
            img.setAttribute("title", fenNotation);
        }
    });
}

function convertImgsToFenDiagrams() {
    "use strict";
    var imgs, i, altAttribute, themeAttribute;
    imgs = document.getElementsByClassName("fen-diagram");
    for (i = 0; i < imgs.length; ++i) {
        altAttribute = imgs[i].getAttribute("alt");
        themeAttribute = imgs[i].getAttribute("theme");
        if (altAttribute !== null) {
            fenDiagram(altAttribute, (themeAttribute === null) ? undefined : themeAttribute, imgs[i]);
        }
    }
}

window.addEventListener("load", function () {
    "use strict";
    convertImgsToFenDiagrams();
}, false);