# aclabs-api01
A simple backend API


API Usage 
Host: https://aclabs01.netlify.app

Supported API endpoints



**GET "/"**
Endpoint Type: Public
Returns: HTTP 200 
    {
        server: {
          status: "running",
        },
    } 

**GET "/org"**
Endpoint Type: Public
Returns: HTTP 200
    {
        org: "AC Labs",
        api: {
            type: "public",
        },
    }

**GET "/org/private"**
Endpoint Type: Private
Returns:
After successful validation of Access Token against Authorization Server
    HTTP 200
    {   
        org: "AC Labs",
        version: "1.0",
        author: "KR",
        api: {
            type: "private",
        },
    } 
 On failure, returns below
    HTTP 401
    {
      status: "Invalid Token",
    }

**GET "/aclabs/user"**
Endpoint Type: Private
Returns:
After successful validation of Access Token against Authorization Server
 and after successful validation of Scope "aclabs:read" or "aclabs:read-write"
    HTTP 200
    {
        org: "AC Labs",
        api: {
            type: "private",
        },
        user: {
            type: "aclabs-User",
        },
    } 
 On insufficient Scope, returns below
    HTTP 403
    {
      error: "403 Forbidden",
      errorSummary: "Requires atleast aclabs:read in the request",
    }


**GET "/aclabs/admin"**
Endpoint Type: Private
Returns:
After successful validation of Access Token against Authorization Server
 and after successful validation of Scope "aclabs:read" or "aclabs:read-write"
    HTTP 200
    {
        org: "AC Labs",
        api: {
            type: "private",
        },
        user: {
            type: "aclabs-Admin",
        },
    }
 On insufficient Scope, returns below
    HTTP 403
    {
      error: "403 Forbidden",
      errorSummary: "Requires aclabs:read-write in the request",
    }
