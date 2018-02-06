// saves about 24 bytes
const COIN_SYMBOL = null;
const DRAW_SCORE = true;
// saves 
const CENTER_SCORE = true;

let ALLOW_JUMPING = true;
// saves about 13 bytes
const FIX_VIEWPORT_WIDTH = 0;
const FIX_VIEWPORT_HEIGHT = 0;
const DEADLY_SPIKES = true;
const DEBUG_COLLISIONS = false;
const SLIGHTLY_SAFER_COLLISIONS = false;
const GROUND_COLOR = '#fff';
const COIN_COLOR = '#ff0';
const ONLY_USE_HORIZONTAL_VELOCITY_TO_GENERATE_LINES = true;
const FIX_COIN_SCALE = 9;

// TODO draw a spinning $ in the coin
// TODO glowing ground
// TODO collectible coins
// TODO buy/sell mode
// TODO scale radius/gravity to screen size

M = Math.abs;
S = Math.sin;
C = Math.cos;
P = Math.PI;
if( FIX_VIEWPORT_HEIGHT && FIX_VIEWPORT_WIDTH ) {
    W = FIX_VIEWPORT_WIDTH;
    H = FIX_VIEWPORT_HEIGHT;    
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
    a.onclick = function () {
        T = t;
    }    
}

s = [
    {
        x: 0, 
        y: 0,
        u: 0, 
        v: -r, 
        a: P/3
    }
];

function update(now: number) {
    requestAnimationFrame(update);

    t = t || now;
    f = now - t;
    t = now;
    c.strokeStyle = GROUND_COLOR;
    c.fillRect(0, 0, W, H);

    // gravity
    if( FIX_COIN_SCALE ) {
        w += f / (111 * FIX_COIN_SCALE);
    } else {
        w += f / W;
    }

    // camera bounds
    X = x - W/3;
    B = y - H/2;
    V = X + W;
    
    // fill in the surfaces
    l = s[0];
    while( l.x <= V ) {
        // add in more lines
        A = l.a;
        n = r * 2;
        q = l.x + C(A) * n;
        k = l.y + S(A) * n;
        if( ONLY_USE_HORIZONTAL_VELOCITY_TO_GENERATE_LINES ) {
            j = v;
        } else {
            j = Math.max(v, w);
        }
        if( DEADLY_SPIKES ) {
            m = 0;
        }
        if( DEADLY_SPIKES && l.d < 0 ) {
            o = P / 3;
            m = -l.d;
        } else if( DEADLY_SPIKES && Math.random() < x/999999 && A < 0 && !l.d ) {
            o = -P / 3;
            m = A;
        } else if( DEADLY_SPIKES && l.d > 0 ) {
            o = -l.d;
        } else {
            o = Math.min(
                Math.max(
                    A + (Math.random() - .5) * P/9, 
                    -P/9 * j
                ), 
                (P*(x+99999)/799999) * (1 - j)
            );        
        }
        p = (A + o)/2 - P/2;
        if( DEADLY_SPIKES ) {
            l = {
                x: q, 
                y: k, 
                u: q + C(p) * r, 
                v: k + S(p) * (m>0?0:r),
                a: o, 
                d: m
            };                
        } else {
            l = {
                x: q, 
                y: k, 
                u: q + C(p) * r, 
                v: k + S(p) * r,
                a: o
            };    
        }
        s.unshift(l);
    }

    // draw in the surface and collide as neccessary 
    D = v * f;
    U = w * f;
    F = Math.atan2(U, D);
    G = U / D;
    j = 0;
    let nextPoint: Point;
    c.beginPath();
    do {
        l = s[j];
        c.lineTo(l.x - X, l.y - B);
        O = l.a - P/2;
        Q = M(O - F);
        /*
        if( Q > P ) {
            Q -= P*2;
        } else if( Q < -P ) {
            Q += P*2;
        }
        */
        if( nextPoint && Q > P/2 && Q < P*3/2 ) {
            // check for collision
            K = Math.tan(l.a);
            if( K != G ) {
                Z = l.v - K * l.u;
                if( v ) {
                    q = ((y - G * x) - Z)/(K - G);
                } else {
                    q = x;
                }
                // is it in bounds of the line?
                if( 
                    // x always goes from right to left
                    q <= nextPoint.u && q >= l.u
                ) {
                    k = K * q + Z;
                    e = x - q;
                    z = y - k;
                    if( (e * e) + (z * z) < (D * D) + (U * U) ) {

                        // bounce off
                        h = S(l.a);
                        g = C(l.a);

                        m = v * g + w * h;
                        n = (v * h - w * g) * .1;
                        v = m * g - n * h;
                        w = m * h + n * g;

                        o = x + D - q;
                        p = y + U - k;

                        m = o * g + p * h;

                        // elevate slightly to avoid falling through ground
                        if( SLIGHTLY_SAFER_COLLISIONS ) {
                            n = -Math.sqrt(M(m)) - .1;
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
    
    if( ALLOW_JUMPING && T && M(T - L) < 299 ) {
        if( FIX_COIN_SCALE ) {
            w -= FIX_COIN_SCALE/20.0;
        } else {
            w -= r/20.0;
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
    c.arc(x - X, y - B, r, 0, P*2);
    if( COIN_COLOR ) {
        c.fillStyle = COIN_COLOR;
        c.fill();
        if( DRAW_SCORE ) {
            if( CENTER_SCORE ) {
                c.textAlign = 'center';
            }
            c.fillText('$'+(999-(y/99|0)), x - X, y - B - r * 2);    
        }
        c.fillStyle = '#000';
        if( COIN_SYMBOL ) {
            c.fillText(COIN_SYMBOL, x - X - r/2, y - B + r/2)
        }
    } else {
        c.stroke();
    }
}
update(0);

