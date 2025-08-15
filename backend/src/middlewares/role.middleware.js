
const adminMiddleware = async (req, res, next) => {
    
    const userRole = req.user.role;

    if(userRole === 'admin' || userRole === 'superadmin') {
        next()
    } else {
        return res.status(403).json({message : 'You Need Access'});
    }
}

const superadminMiddleware = async (req, res, next) => {
    
    const userRole = req.user.role;

    if(userRole === 'superadmin') {
        next();
    } else {
        return res.status(403).json({message: 'You Need Access'});
    }
}

export { adminMiddleware, superadminMiddleware}