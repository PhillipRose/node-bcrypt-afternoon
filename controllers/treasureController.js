

module.exports = {
    //remember to put req. in front of app when dealing with a db
    dragonTreasure: async (res, req) => {
        const treasure = await req.app.get('db').get_dragon_treasure(1)
        return res.status(200).send(treasure) 
        
    },
    //brackets are used around req.session.user.id because the $1 placeholder is used in sql file (works like the order of parameters in functions $1 is first item in [] $2 is second thing in [] or comma)
    getUserTreasure: async (res, req) => {
        const userTreasure = await req.app.get(`db`).get_user_treasure([req.session.user.id])
        return res.status(200).send(userTreasure)
    },
    addUserTreasure: async (res, req) =>{
        const { treasureUrl } = req.body,
        { id } = req.session.user,
        userTreasure = await req.app.get(`db`).add_user_treasure([treasureUrl, id]);
        return res.status(200).send(userTreasure)
    },
    getAllTreasure: async (res, req) =>{
        const allTreasure = await req.app.get(`db`).get_all_treasure()
        return res.status(200).send(allTreasure)
    }
}