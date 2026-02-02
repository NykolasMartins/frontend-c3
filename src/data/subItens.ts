interface subItem {
    id: number,
    title: string,
    link: string,
    url?: string,
    c1?: string,
    c2?: string,
}

interface CategoriaItens{
    id: number,
    title: string,
    link: string,
    subItens: subItem[],
    url?: string;
    c1?: string,
    c2?: string,
}

export const itens: CategoriaItens[] = [
    {
        id: 1,
        title: 'Card Games',
        link: '/card-games',
        subItens: [
    
            {
                id: 1,
                title: 'Pokemon TCG',
                link: '/card-games/pokemontcg',
                url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiRlL8DGXW-Od006EzC4jSftT_9L_Nlb0bEZEuhgGSO1kVJK9FD2Q00PUiH2CO5rapSTSQAKT56eMnsZ4ad3bSCC57HO1zD0aRGFBsR8rbbVfrSeBpKRXC_RE4SS27vCBKB6R-WF-XIia0/s1600/Pok%C3%A9mon_Trading_Card_video_Game.png',
                c1: '#2F6EB5',
                c2: '#A70E13',
            },
            {
                id: 2,
                title: 'Magic: the Gathering',
                link: '/card-games/magic',
                url: 'https://1000logos.net/wp-content/uploads/2022/10/Magic-The-Gathering-Logo-1993.png',
                c1: '#E9C200',
                c2: '#D70017',
                
            },
            {
                id: 3,
                title: 'Yu-Gi-Oh!',
                link: '/card-games/yugioh',
                url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhle4a94-fXG-I1wocdLZ7T50XCPixfjMiN3uqkStABhGqs8XdYB8KSbh7_Ej8Qq9SooUDCt9dUJfGiyU854HY-hw8yL3sDYuMcPXYto_l-3zLxIgU6cG2NqEyqBpRRBiOu-ZNdUzlW-Ts/w1200-h630-p-k-no-nu/Logo+Yu-Gi-Oh%2521+03.png',
                c1: '#9f0f0f',
                c2: '#000000',
            },
            {
                id: 4,
                title: 'One Piece Card Game',
                link: '/card-games/onepiece',
                url: 'https://static.wixstatic.com/media/57a197_e334385962ac4203abe6390f3b6ff4c6~mv2.png/v1/fill/w_560,h_314,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ONE%20PIECE%20LOGO.png',
                c1: '#b5b5b5',
                c2: '#000000',
            },
            {
                id: 5,
                title: 'Disney Lorcana',
                link: '/card-games/lorcana',
                url: 'https://static.wixstatic.com/media/91be11_f9288d8f9cea4f0eaf0c28960445cecf~mv2.png/v1/crop/x_60,y_0,w_624,h_355/fill/w_660,h_376,fp_0.50_0.50,lg_1,q_85,enc_avif,quality_auto/Disney%20Lorcana_TCG_Logo%20transparent.png',
                c1: '#cbaf5a',
                c2: '#273058',
            }
        ],
    },
    {
        id: 2,
        title: 'Funko POP',
        link: '/funko-pop',
        url: 'https://universogeeky.com/cdn/shop/collections/funko-pop_600x600_crop_center.png?v=1702119471',
        c1: '#0285FD',
        c2: '#F9AD00',
        subItens: [
        
            {
                id: 1,
                title: 'Marvel',
                link: '/funko-pop/marvel',
            },
            {
                id: 2,
                title: 'DC Comics',
                link: 'funko-pop/dc'
            },
            {
                id: 3,
                title: 'Star Wars',
                link: 'funko-pop/star-wars'
            },
            {
                id: 4,
                title: 'Disney',
                link: 'funko-pop/disney'
            },
            {
                id: 5,
                title: 'Harry Potter',
                link: 'funko-pop/harry-potter'
            }
        ],
    },

    {
        id: 3,
        title: 'Action Figures',
        link: '/action-figures',
        subItens: [
            {
                id: 1,
                title: 'Marvel',
                link: '/action-figures/marvel'
            },
            {
                id: 2,
                title: 'DC',
                link: '/action-figures/dc'
            },
            {
                id: 3,
                title: 'Dragon Ball',
                link: '/action-figures/dragon-ball'
            },
            {
                id: 4,
                title: 'Star Wars',
                link: '/action-figures/star-wars'
            },
            {
                id: 5,
                title: 'Pokemon',
                link: '/action-figures/pokemon'
            }
        ],
    },

    {
        id: 4,
        title: 'Outros Colecionáveis',
        link: '/outros',
        subItens: [
            {
                id: 1,
                title: "HQ's",
                link: '/outros/hqs'
            },
            {
                id: 2,
                title: 'Figurinhas',
                link: '/outros/figurinhas'
            },
            {
                id: 3,
                title: 'Miniaturas',
                link: '/outros/miniaturas'
            },
            {
                id: 4,
                title: 'Video Games',
                link: '/outros/video-games'
            },
            {
                id: 5,
                title: 'Lego',
                link: '/outros/lego'
            }
        ]
    }
]