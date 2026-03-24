Updated saved memory

Thanks for sharing your code — it’s already well-structured! Below is a **revised version** of your Express server with:

### ✅ Improvements made:

- **Removed redundant comments** and unused variables (like `MSG_ARRAY`)
- 🧹 **Cleaner middleware organization**
- 🔐 **Stronger security defaults** (e.g., `secure`, `httpOnly`, `sameSite`)
- 🚫 Fixed missing `await`/`async` in some asynchronous code like bcrypt comparison
- 📦 Added recommendations for useful production middleware (`helmet`, `compression`)
- 🔁 Applied `authenticateToken` consistently

---

## ✅ REVISED EXPRESS SERVER (Secure + Cleaned)

<pre class="overflow-visible!" data-start="608" data-end="5464"><div class="contain-inline-size rounded-md border-[0.5px] border-token-border-medium relative bg-token-sidebar-surface-primary"><div class="flex items-center text-token-text-secondary px-4 py-2 text-xs font-sans justify-between h-9 bg-token-sidebar-surface-primary dark:bg-token-main-surface-secondary select-none rounded-t-[5px]">js</div><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-sidebar-surface-primary text-token-text-secondary dark:bg-token-main-surface-secondary flex items-center rounded-sm px-2 font-sans text-xs"><button class="flex gap-1 items-center select-none px-4 py-1" aria-label="Copy"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"></path></svg>Copy</button><span class="" data-state="closed"><button class="flex items-center gap-1 px-4 py-1 select-none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs"><path d="M2.5 5.5C4.3 5.2 5.2 4 5.5 2.5C5.8 4 6.7 5.2 8.5 5.5C6.7 5.8 5.8 7 5.5 8.5C5.2 7 4.3 5.8 2.5 5.5Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.66282 16.5231L5.18413 19.3952C5.12203 19.7678 5.09098 19.9541 5.14876 20.0888C5.19933 20.2067 5.29328 20.3007 5.41118 20.3512C5.54589 20.409 5.73218 20.378 6.10476 20.3159L8.97693 19.8372C9.72813 19.712 10.1037 19.6494 10.4542 19.521C10.7652 19.407 11.0608 19.2549 11.3343 19.068C11.6425 18.8575 11.9118 18.5882 12.4503 18.0497L20 10.5C21.3807 9.11929 21.3807 6.88071 20 5.5C18.6193 4.11929 16.3807 4.11929 15 5.5L7.45026 13.0497C6.91175 13.5882 6.6425 13.8575 6.43197 14.1657C6.24513 14.4392 6.09299 14.7348 5.97903 15.0458C5.85062 15.3963 5.78802 15.7719 5.66282 16.5231Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.5 7L18.5 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Edit</button></span></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-js"><span><span>// Basic setup</span><span>
</span><span>require</span><span>(</span><span>'dotenv'</span><span>).</span><span>config</span><span>();
</span><span>const</span><span> express = </span><span>require</span><span>(</span><span>'express'</span><span>);
</span><span>const</span><span> jwt = </span><span>require</span><span>(</span><span>'jsonwebtoken'</span><span>);
</span><span>const</span><span> cookieParser = </span><span>require</span><span>(</span><span>'cookie-parser'</span><span>);
</span><span>const</span><span> cors = </span><span>require</span><span>(</span><span>'cors'</span><span>);
</span><span>const</span><span> path = </span><span>require</span><span>(</span><span>'path'</span><span>);
</span><span>const</span><span> { </span><span>Pool</span><span> } = </span><span>require</span><span>(</span><span>'pg'</span><span>);
</span><span>const</span><span> bcrypt = </span><span>require</span><span>(</span><span>'bcrypt'</span><span>);
</span><span>const</span><span> helmet = </span><span>require</span><span>(</span><span>'helmet'</span><span>); </span><span>// Extra security</span><span>
</span><span>const</span><span> compression = </span><span>require</span><span>(</span><span>'compression'</span><span>); </span><span>// Improve performance</span><span>

</span><span>const</span><span> app = </span><span>express</span><span>();
</span><span>const</span><span></span><span>PORT</span><span> = process.</span><span>env</span><span>.</span><span>SERVER_PORT</span><span>;
</span><span>const</span><span></span><span>SECRET_KEY</span><span> = process.</span><span>env</span><span>.</span><span>JWT_SECRET_KEY</span><span>;
</span><span>const</span><span></span><span>SALT_ROUNDS</span><span> = </span><span>10</span><span>;

</span><span>// PostgreSQL config</span><span>
</span><span>const</span><span> pool = </span><span>new</span><span></span><span>Pool</span><span>({
  </span><span>user</span><span>: process.</span><span>env</span><span>.</span><span>DB_USER</span><span>,
  </span><span>host</span><span>: process.</span><span>env</span><span>.</span><span>DB_HOST</span><span>,
  </span><span>database</span><span>: process.</span><span>env</span><span>.</span><span>DB_NAME</span><span>,
  </span><span>password</span><span>: process.</span><span>env</span><span>.</span><span>DB_PASSWORD</span><span>,
  </span><span>port</span><span>: process.</span><span>env</span><span>.</span><span>DB_PORT</span><span>
});

</span><span>// CORS setup</span><span>
</span><span>const</span><span> allowedOrigins = [
  </span><span>'http://localhost:7676'</span><span>, 
  </span><span>'http://localhost:5174'</span><span>,
  </span><span>'http://localhost:3111'</span><span>,
  </span><span>'http://localhost:5173'</span><span>,
  </span><span>'http://localhost:7678'</span><span>
];
</span><span>const</span><span> corsOptions = {
  </span><span>origin</span><span>: </span><span>(origin, callback</span><span>) => {
    </span><span>if</span><span> (!origin || allowedOrigins.</span><span>includes</span><span>(origin)) {
      </span><span>callback</span><span>(</span><span>null</span><span>, </span><span>true</span><span>);
    } </span><span>else</span><span> {
      </span><span>callback</span><span>(</span><span>new</span><span></span><span>Error</span><span>(</span><span>'Not allowed by CORS'</span><span>));
    }
  },
  </span><span>methods</span><span>: [</span><span>'GET'</span><span>, </span><span>'POST'</span><span>, </span><span>'PUT'</span><span>, </span><span>'DELETE'</span><span>],
  </span><span>credentials</span><span>: </span><span>true</span><span>
};

</span><span>// Middleware</span><span>
app.</span><span>use</span><span>(</span><span>helmet</span><span>());
app.</span><span>use</span><span>(</span><span>compression</span><span>());
app.</span><span>use</span><span>(</span><span>cors</span><span>(corsOptions));
app.</span><span>use</span><span>(</span><span>cookieParser</span><span>());
app.</span><span>use</span><span>(express.</span><span>static</span><span>(</span><span>'public'</span><span>));
app.</span><span>use</span><span>(express.</span><span>urlencoded</span><span>({ </span><span>extended</span><span>: </span><span>true</span><span> }));
app.</span><span>set</span><span>(</span><span>'view engine'</span><span>, </span><span>'ejs'</span><span>);
app.</span><span>set</span><span>(</span><span>'views'</span><span>, path.</span><span>join</span><span>(__dirname, </span><span>'views'</span><span>));

</span><span>// Inject messages into all views</span><span>
app.</span><span>use</span><span>(</span><span>(req, res, next</span><span>) => {
  res.</span><span>locals</span><span>.</span><span>message</span><span> = </span><span>""</span><span>;
  </span><span>next</span><span>();
});

</span><span>// Routes</span><span>
app.</span><span>get</span><span>(</span><span>'/'</span><span>, </span><span>(req, res</span><span>) => res.</span><span>redirect</span><span>(</span><span>'/login'</span><span>));

app.</span><span>get</span><span>(</span><span>'/login'</span><span>, </span><span>(req, res</span><span>) => {
  res.</span><span>locals</span><span>.</span><span>message</span><span> = req.</span><span>query</span><span>.</span><span>message</span><span> ? </span><span>`${req.query.message}</span><span>!!!` : </span><span>''</span><span>;
  res.</span><span>render</span><span>(</span><span>'login'</span><span>);
});

app.</span><span>get</span><span>(</span><span>'/signup'</span><span>, </span><span>(req, res</span><span>) => res.</span><span>render</span><span>(</span><span>'signup'</span><span>));

app.</span><span>post</span><span>(</span><span>'/login'</span><span>, </span><span>async</span><span> (req, res) => {
  </span><span>const</span><span> { username, password } = req.</span><span>body</span><span>;
  </span><span>try</span><span> {
    </span><span>const</span><span> { rows } = </span><span>await</span><span> pool.</span><span>query</span><span>(</span><span>'SELECT * FROM users WHERE username = $1'</span><span>, [username]);
    </span><span>if</span><span> (rows.</span><span>length</span><span> === </span><span>0</span><span>) {
      res.</span><span>locals</span><span>.</span><span>message</span><span> = </span><span>"Invalid username or password."</span><span>;
      </span><span>return</span><span> res.</span><span>status</span><span>(</span><span>401</span><span>).</span><span>render</span><span>(</span><span>'login'</span><span>);
    }

    </span><span>const</span><span> user = rows[</span><span>0</span><span>];
    </span><span>const</span><span> match = </span><span>await</span><span> bcrypt.</span><span>compare</span><span>(password, user.</span><span>password</span><span>);
    </span><span>if</span><span> (!match) {
      res.</span><span>locals</span><span>.</span><span>message</span><span> = </span><span>"Invalid username or password."</span><span>;
      </span><span>return</span><span> res.</span><span>status</span><span>(</span><span>401</span><span>).</span><span>render</span><span>(</span><span>'login'</span><span>);
    }

    </span><span>const</span><span> token = jwt.</span><span>sign</span><span>({ </span><span>username</span><span>: user.</span><span>username</span><span>, </span><span>id</span><span>: user.</span><span>id</span><span> }, </span><span>SECRET_KEY</span><span>, {
      </span><span>expiresIn</span><span>: </span><span>'1h'</span><span>,
      </span><span>issuer</span><span>: </span><span>'myapp.com'</span><span>,
      </span><span>audience</span><span>: </span><span>'myapp-client'</span><span>,
      </span><span>subject</span><span>: user.</span><span>id</span><span>.</span><span>toString</span><span>()
    });

    res.</span><span>cookie</span><span>(</span><span>'authToken'</span><span>, token, {
      </span><span>httpOnly</span><span>: </span><span>true</span><span>,
      </span><span>secure</span><span>: process.</span><span>env</span><span>.</span><span>NODE_ENV</span><span> === </span><span>'production'</span><span>,
      </span><span>sameSite</span><span>: </span><span>'Strict'</span><span>
    });

    res.</span><span>redirect</span><span>(</span><span>'/menu'</span><span>);
  } </span><span>catch</span><span> (err) {
    </span><span>console</span><span>.</span><span>error</span><span>(</span><span>'Login error:'</span><span>, err);
    res.</span><span>status</span><span>(</span><span>500</span><span>).</span><span>send</span><span>(</span><span>"Server error"</span><span>);
  }
});

app.</span><span>post</span><span>(</span><span>'/signup'</span><span>, </span><span>async</span><span> (req, res) => {
  </span><span>const</span><span> { username, email, password } = req.</span><span>body</span><span>;
  </span><span>if</span><span> (!username || !email || !password) {
    res.</span><span>locals</span><span>.</span><span>message</span><span> = </span><span>"All fields are required."</span><span>;
    </span><span>return</span><span> res.</span><span>status</span><span>(</span><span>400</span><span>).</span><span>render</span><span>(</span><span>'signup'</span><span>);
  }

  </span><span>try</span><span> {
    </span><span>const</span><span> hash = </span><span>await</span><span> bcrypt.</span><span>hash</span><span>(password, </span><span>SALT_ROUNDS</span><span>);
    </span><span>const</span><span> result = </span><span>await</span><span> pool.</span><span>query</span><span>(
      </span><span>'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *'</span><span>,
      [username, email, hash]
    );

    </span><span>const</span><span> token = jwt.</span><span>sign</span><span>({ username }, </span><span>SECRET_KEY</span><span>, { </span><span>expiresIn</span><span>: </span><span>'1h'</span><span> });

    res.</span><span>cookie</span><span>(</span><span>'authToken'</span><span>, token, {
      </span><span>httpOnly</span><span>: </span><span>true</span><span>,
      </span><span>secure</span><span>: process.</span><span>env</span><span>.</span><span>NODE_ENV</span><span> === </span><span>'production'</span><span>,
      </span><span>sameSite</span><span>: </span><span>'Strict'</span><span>
    });

    res.</span><span>redirect</span><span>(</span><span>'/menu'</span><span>);
  } </span><span>catch</span><span> (err) {
    </span><span>console</span><span>.</span><span>error</span><span>(</span><span>'Signup error:'</span><span>, err);
    res.</span><span>status</span><span>(</span><span>500</span><span>).</span><span>send</span><span>(</span><span>"Server error"</span><span>);
  }
});

app.</span><span>get</span><span>(</span><span>'/menu'</span><span>, authenticateToken, </span><span>(req, res</span><span>) => {
  res.</span><span>render</span><span>(</span><span>'menu'</span><span>);
});

app.</span><span>post</span><span>(</span><span>'/validate-token'</span><span>, authenticateToken, </span><span>(req, res</span><span>) => {
  res.</span><span>status</span><span>(</span><span>200</span><span>).</span><span>send</span><span>(req.</span><span>user</span><span>); </span><span>// Token is valid</span><span>
});

app.</span><span>post</span><span>(</span><span>'/logout'</span><span>, </span><span>(req, res</span><span>) => {
  res.</span><span>setHeader</span><span>(</span><span>'Cache-Control'</span><span>, </span><span>'no-store'</span><span>);
  res.</span><span>clearCookie</span><span>(</span><span>'authToken'</span><span>, {
    </span><span>httpOnly</span><span>: </span><span>true</span><span>,
    </span><span>secure</span><span>: process.</span><span>env</span><span>.</span><span>NODE_ENV</span><span> === </span><span>'production'</span><span>,
    </span><span>sameSite</span><span>: </span><span>'Strict'</span><span>,
    </span><span>path</span><span>: </span><span>'/'</span><span>
  });
  res.</span><span>redirect</span><span>(</span><span>'/login?message=Logged_out_successfully'</span><span>);
});

</span><span>// Middleware for token validation</span><span>
</span><span>function</span><span></span><span>authenticateToken</span><span>(</span><span>req, res, next</span><span>) {
  </span><span>const</span><span> token = req.</span><span>cookies</span><span>.</span><span>authToken</span><span>;
  </span><span>if</span><span> (!token) {
    </span><span>return</span><span> res.</span><span>status</span><span>(</span><span>401</span><span>).</span><span>redirect</span><span>(</span><span>'/login?message=Please_log_in'</span><span>);
  }

  jwt.</span><span>verify</span><span>(token, </span><span>SECRET_KEY</span><span>, {
    </span><span>issuer</span><span>: </span><span>'myapp.com'</span><span>,
    </span><span>audience</span><span>: </span><span>'myapp-client'</span><span>
  }, </span><span>(err, decoded</span><span>) => {
    </span><span>if</span><span> (err) {
      </span><span>console</span><span>.</span><span>error</span><span>(</span><span>"JWT error:"</span><span>, err.</span><span>message</span><span>);
      res.</span><span>clearCookie</span><span>(</span><span>'authToken'</span><span>);
      </span><span>return</span><span> res.</span><span>status</span><span>(</span><span>403</span><span>).</span><span>redirect</span><span>(</span><span>'/login?message=Session_expired_please_login_again'</span><span>);
    }

    req.</span><span>user</span><span> = decoded;
    </span><span>next</span><span>();
  });
}

app.</span><span>listen</span><span>(</span><span>PORT</span><span>, </span><span>() =></span><span> {
  </span><span>console</span><span>.</span><span>log</span><span>(</span><span>`Server is running on port ${PORT}</span><span>`);
});
</span></span></code></div></div></pre>

---

## 🧠 Summary of Key Improvements

| Category       | Changes Made                                                            |
| -------------- | ----------------------------------------------------------------------- |
| ✅ Clean Code  | Removed unused variables, cleaned up middleware setup                   |
| 🔐 Security    | Used `helmet`,`httpOnly`,`secure`,`sameSite`, and JWT claims validation |
| ⏱ Async Fix    | Properly used `async/await`in `bcrypt.compare`and DB queries            |
| 🚀 Performance | Added `compression()`middleware to reduce response size                 |
| 🧪 Robust Auth | Improved JWT structure with issuer, audience, and subject               |

---

If you want extra features like refresh tokens, rate limiting, or login attempt tracking, I can help you extend it further. Want to go that route?
