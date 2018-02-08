// saves about 24 bytes
const COIN_SYMBOL = null;
const DRAW_SCORE = true;
// saves 19 bytes
const CENTER_SCORE = false;

const ALLOW_JUMPING = true;
// saves about 13 bytes if both on
const FIX_VIEWPORT_WIDTH = 0; // 799
const FIX_VIEWPORT_HEIGHT = 0;
const FIX_COIN_SCALE = 0; // 9
const DEADLY_SPIKES = true;
const DEBUG_COLLISIONS = false;
const SLIGHTLY_SAFER_COLLISIONS = false;
const GROUND_COLOR = '#fff';
const COIN_COLOR = '#ff0';
const ONLY_USE_HORIZONTAL_VELOCITY_TO_GENERATE_LINES = true;
// saves 5 bytes
const MAX_MILLISECONDS_PER_FRAME = 99;
const GOOD_TOUCH = true;
const RESTITUTION = 0.3;
const DISABLE_GRADIENT_EQUALITY_CHECK = true;
const LEVEL_GENERATION_SCALE_FACTOR = 2;

// TODO draw a spinning $ in the coin
// TODO glowing ground
// TODO collectible coins
// TODO buy/sell mode
// TODO scale radius/gravity to screen size

//M = Math.abs;
//S = Math.sin;
//C = Math.cos;
//P = Math.PI;
if( FIX_VIEWPORT_HEIGHT && FIX_VIEWPORT_WIDTH ) {
    W = FIX_VIEWPORT_WIDTH;
    H = FIX_VIEWPORT_HEIGHT;    
} else if( FIX_VIEWPORT_WIDTH ) {
    W = FIX_VIEWPORT_WIDTH;
    H = FIX_VIEWPORT_WIDTH*a.height/a.width;
    a.width = W;
    a.height= H;
} else {
    W = a.width;
    H = a.height;    
}

//let scale = canvasWidth / 50;

x = W;
y = 0;
v = 0;
w = 0;
t = 0;
T = 0;
L = 0;
if( FIX_COIN_SCALE ) {
    r = FIX_COIN_SCALE;
} else {
    r = W / 99;
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
        y: H,
        u: 0, 
        v: H, 
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
    t = now;
    c.strokeStyle = GROUND_COLOR;
    c.fillRect(0, 0, W, H);

    // gravity
    if( FIX_COIN_SCALE ) {
        w += f / 999;
    } else {
        w += (f * r) / 9999;
    }

    // camera bounds
    X = x - W/4;
    B = y - H/2;
    
    // fill in the surfaces
    l = s[0];    
    while( l.x <= X + W ) {
        // add in more lines
        q = l.x + Math.cos(l.a) * r * LEVEL_GENERATION_SCALE_FACTOR;
        k = l.y + Math.sin(l.a) * r * LEVEL_GENERATION_SCALE_FACTOR;
        if( ONLY_USE_HORIZONTAL_VELOCITY_TO_GENERATE_LINES ) {
            j = v;
        } else {
            j = Math.max(v, w);
        }
        if( !FIX_COIN_SCALE ) {
            j /= r / 9;
        }
        if( DEADLY_SPIKES ) {
            m = 0;
        }
        if( DEADLY_SPIKES && l.d < 0 ) {
            o = Math.PI / 3;
            m = -l.d;
        } else if( DEADLY_SPIKES && Math.random() < x/999999 && l.a < 0 && !l.d ) {
            o = -Math.PI / 3;
            m = l.a;
        } else if( DEADLY_SPIKES && l.d > 0 ) {
            o = -l.d;
        } else {
            o = Math.min(
                Math.max(
                    l.a + (Math.random() - .5) * Math.PI/9, 
                    -Math.PI / 9 * j
                ), 
                (Math.PI*(x+99999)/999999) * (1 - j)
            );        
        }
        p = (l.a + o)/2 - Math.PI/2;
        if( DEADLY_SPIKES ) {
            l = {
                x: q, 
                y: k, 
                u: q + Math.cos(p) * r, 
                v: k + Math.sin(p) * (m>0?0:r),
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
        s.unshift(l);
    }

    // draw in the surface and collide as neccessary 
    D = v * f;
    U = w * f;
    //F = Math.atan2(U, D);
    j = 0;
    c.beginPath();
    do {
        l = s[j];
        c.lineTo(l.x - X, l.y - B);
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
                        h = Math.sin(l.a);
                        g = Math.cos(l.a);

                        m = v * g + w * h;
                        if( RESTITUTION ) {
                            n = (v * h - w * g) * RESTITUTION;
                        } else {
                            n = 0;
                        }
                        v = m * g - n * h;
                        w = m * h + n * g;

                        o = x + D - q;
                        p = y + U - k;

                        m = o * g + p * h;

                        // elevate slightly to avoid falling through ground
                        if( SLIGHTLY_SAFER_COLLISIONS ) {
                            n = -Math.sqrt(Math.abs(m)) - .1;
                        } else {
                            n = -1;
                        }

                        x = q;
                        y = k;

                        D = m * g - n * h;
                        U = m * h + n * g;

                        L = now;

                        if( DEADLY_SPIKES && l.d ) {
                            x = W;
                            y = 0;
                        }
                    }
                }

            }
        }

        nextPoint = l;
        j++;
    } while( nextPoint.x > X )
    c.stroke();          
    
    x += D;
    y += U;     
    
    if( ALLOW_JUMPING && T && Math.abs(T - L) < 299 ) {
        if( FIX_COIN_SCALE ) {
            w = -FIX_COIN_SCALE/20.0;
        } else {
            w = -r/20.0;
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
            c.lineTo(l.u - X, l.v - B);
            nextPoint = l;
        } while( nextPoint.x > X);
        c.stroke();
    }

    // draw player
    c.beginPath();
    c.arc(x - X, y - B, r, 0, Math.PI*2);
    if( COIN_COLOR ) {
        c.fillStyle = COIN_COLOR;
        c.fill();
        if( DRAW_SCORE ) {
            if( CENTER_SCORE ) {
                c.textAlign = 'center';
                c.fillText('$'+(999-(y/99|0)), x - X, y - B - r * 2);    
            } else {
                c.fillText('$'+(999-(y/99|0)), x - X - r, y - B - r * 2);    
            }
        }
        c.fillStyle = '#000';
        if( COIN_SYMBOL ) {
            c.fillText(COIN_SYMBOL, x - X - r/2, y - B + r/2)
        }
    } else {
        c.stroke();
    }
})(0);

