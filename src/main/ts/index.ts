// saves about 24 bytes
const COIN_SYMBOL = null;
const DRAW_SCORE = true;
// saves 19 bytes
const CENTER_SCORE = false;

const ALLOW_JUMPING = true;
const FLATTEN_AT_ZERO = false;
const ZERO = 999;

const FIX_VIEWPORT_WIDTH = 0; // 799
const FIX_VIEWPORT_HEIGHT = 0;
const FIX_COIN_SCALE = 0; // 9

const DEADLY_SPIKES = true;
const DEBUG_COLLISIONS = false;
const SLIGHTLY_SAFER_COLLISIONS = false;
// #999 saves a byte due to compression
const GROUND_COLOR = '#fff';
// #990 saves a byte due to compression
const COIN_COLOR = '#ff0'; // #ff0
// #099 saves a byte due to compression
const BACKGROUND_COLOR = '#033'; // #000
// saves 5 bytes
const MAX_MILLISECONDS_PER_FRAME = 99;
// false saves 17 bytes
const GOOD_TOUCH = true;
const RESTITUTION = 0.3;
const DISABLE_GRADIENT_EQUALITY_CHECK = true;
const LEVEL_GENERATION_SCALE_FACTOR = 2;

// TODO draw a spinning $ in the coin
// TODO glowing ground
// TODO collectible coins
// TODO buy/sell mode

//M = Math.abs;
//S = Math.sin;
//C = Math.cos;
//P = Math.PI;
if( FIX_VIEWPORT_HEIGHT && FIX_VIEWPORT_WIDTH ) {
    a.width = FIX_VIEWPORT_WIDTH;
    a.height = FIX_VIEWPORT_HEIGHT;    
} else if( FIX_VIEWPORT_WIDTH ) {
    a.height= FIX_VIEWPORT_WIDTH*a.height/a.width;
    a.width = FIX_VIEWPORT_WIDTH;
} 

//let scale = canvasWidth / 50;

x = a.width;
y = 0;
v = 0;
w = 0;
t = 0;
T = 0;
L = 0;
if( FIX_COIN_SCALE ) {
    r = FIX_COIN_SCALE;
} else {
    r = a.width / 99;
}

if( ALLOW_JUMPING ) {
    // have to add to canvas, otherwise it doesn't work on mobile
    if( GOOD_TOUCH ) {
        onmousedown = a.ontouchstart = () => {
            T = t;
        };
    } else {
        a.onclick = () => {
            T = t;
        }        
    }
}

s = [
    {
        x: 0, 
        y: 0,
        u: 0, 
        v: 0, 
        a: 0
    }
];

(_ = (now: number, nextPoint?: Point) => {
    requestAnimationFrame(_);

    if( MAX_MILLISECONDS_PER_FRAME ) {
        f = Math.min(now - (t || now), MAX_MILLISECONDS_PER_FRAME);
    } else {
        f = now - (t || now);
    }

    // gravity
    /*
    if( FIX_COIN_SCALE ) {
        w += f / 999;
    } else {
        w += (f * r) / 9999;
    }
    */
    // distance traveled
    D = v * f;
    U = (FIX_COIN_SCALE?w += f / 999:w += (f * r) / 9999) * f;

    // camera bounds
    X = x - a.width/4;
    Y = y - a.height/2;
    
    t = now;

    // clear screen
    c.fillRect(0, 0, a.width, a.height);
    // fill in the surfaces
        
    for(
        l = s[0];
        l.x <= X + a.width;
        s.unshift(l)
    ) {
        q = l.x + Math.cos(l.a) * (LEVEL_GENERATION_SCALE_FACTOR?r * LEVEL_GENERATION_SCALE_FACTOR:r);
        // add in more lines
        k = l.y + Math.sin(l.a) * (LEVEL_GENERATION_SCALE_FACTOR?r * LEVEL_GENERATION_SCALE_FACTOR:r);
        if( !FIX_COIN_SCALE ) {
            j = x>a.width?v * r / 9 + (l.v - y)*4/a.width - r/50:0;
        } else {
            // TODO not sure this forumla is right
            j =  x>a.width?v + (l.v - y - 20)/99:0;
        }
        if( DEADLY_SPIKES ) {
            m = 0;
        }
        if( DEADLY_SPIKES && l.d > 1 ) {
            o = Math.PI / 3;
            m = 1;
        } else if( DEADLY_SPIKES && Math.random() < (.3 - Math.abs(l.a))*Math.sqrt(x)/999 && !l.d ) {
            o = -Math.PI / 3;
            m = 2;
        } else {
            if( FLATTEN_AT_ZERO && k > ZERO/r ) {
                o = 0;
            } else {
                o = Math.min(
                    Math.max(
                        l.d?0:l.a + (Math.random() - .5) * Math.PI/9, 
                        -Math.PI / 9 * j
                    ), 
                    (Math.PI*(x+9999)/99999) * (1 - j)
                );            
            }
        }
        p = (l.a + o)/2 - Math.PI/2;
        if( DEADLY_SPIKES ) {
            l = {
                x: q, 
                y: k, 
                u: q + Math.cos(p) * r, 
                v: k + (m>0?0:Math.sin(p) * r),
                a: o, 
                d: m
            };                
        } else {
            l = {
                x: q, 
                y: k, 
                u: q + Math.cos(p) * r, 
                v: k + Math.sin(p) * r,
                a: o
            };    
        }
        
    }

    // draw in the surface and collide as neccessary 
    //F = Math.atan2(U, D);
    c.strokeStyle = GROUND_COLOR;
    c.beginPath();
    for(
        j=0; 
        !nextPoint || nextPoint.x > X;
        nextPoint = l
    ) {
        l = s[j++];
        c.lineTo(l.x - X, l.y - Y);
        O = l.a - Math.PI/2;
        Q = Math.abs(O - Math.atan2(U, D));
        if( nextPoint && Q > Math.PI/2 && Q < Math.PI*3/2 ) {
            // check for collision
            K = Math.tan(l.a);
            G = U / D;
            if( DISABLE_GRADIENT_EQUALITY_CHECK || K != G ) {
                Z = l.v - K * l.u;
                if( v ) {
                    q = ((y - G * x) - Z)/(K - G);
                } else {
                    q = x;
                }
                // is it in bounds of the line?
                if( 
                    // x always goes from right to left
                    q < nextPoint.u && q >= l.u
                ) {
                    k = K * q + Z;
                    e = x - q;
                    z = y - k;
                    if( (e * e) + (z * z) < (D * D) + (U * U) ) {

                        // bounce off
                        //h = Math.sin(l.a);
                        //g = Math.cos(l.a);

                        m = v * Math.cos(l.a) + w * Math.sin(l.a);
                        if( RESTITUTION ) {
                            n = (v * Math.sin(l.a) - w * Math.cos(l.a)) * RESTITUTION;
                        } else {
                            n = 0;
                        }
                        v = m * Math.cos(l.a) - n * Math.sin(l.a);
                        w = m * Math.sin(l.a) + n * Math.cos(l.a);

                        o = x + D - q;
                        p = y + U - k;

                        m = o * Math.cos(l.a) + p * Math.sin(l.a);

                        // elevate slightly to avoid falling through ground
                        if( SLIGHTLY_SAFER_COLLISIONS ) {
                            n = -Math.sqrt(Math.abs(m)) - .1;
                        } else {
                            n = -1;
                        }

                        x = q;
                        y = k;

                        D = m * Math.cos(l.a) - n * Math.sin(l.a);
                        U = m * Math.sin(l.a) + n * Math.cos(l.a);

                        L = now;

                        if( DEADLY_SPIKES && l.d ) {
                            x = a.width;
                            y = 0;
                        }
                    }
                }

            }
        }
    } 
    c.stroke();          
    
    x += D;
    y += U;     
    
    if( ALLOW_JUMPING && T && Math.abs(T - L) < 299 ) {
        if( FIX_COIN_SCALE ) {
            w = -FIX_COIN_SCALE/30;
        } else {
            w = -r/30;
            //w -= 0.5;
        }
        T = 0;
        L = 0;
    }        

    // debug collision bounds
    if( DEBUG_COLLISIONS ) {
        c.strokeStyle = '#F00';
        c.beginPath();
        j = 0;
        do {
            l = s[j];
            j++;
            c.lineTo(l.u - X, l.v - Y);
            nextPoint = l;
        } while( nextPoint.x > X);
        c.stroke();
    }

    // draw player
    c.beginPath();
    c.arc(x - X, y - Y, r, 0, Math.PI*2);
    if( COIN_COLOR ) {
        c.fillStyle = COIN_COLOR;
        c.fill();
        if( DRAW_SCORE ) {
            if( CENTER_SCORE ) {
                c.textAlign = 'center';
                c.fillText('$'+(ZERO-(y/r|0)), x - X, y - Y - r * 2);    
            } else {
                c.fillText('$'+(ZERO-(y/r|0)), x - X - r, y - Y - r * 2);    
            }
        }
        c.fillStyle = BACKGROUND_COLOR;
        if( COIN_SYMBOL ) {
            c.fillText(COIN_SYMBOL, x - X - r/2, y - Y + r/2)
        }
    } else {
        if( BACKGROUND_COLOR ) {
            c.fillStyle = BACKGROUND_COLOR;
        }
        c.stroke();
    }
})(0);

