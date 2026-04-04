// SessionTypes.ts
export interface SessionTypes {
    name: string;
    picture: Picture;
    sub: string;
    token: string;
    id: number;
    image: Image;
    list: string[];
    version: string;
    iat: number;
    exp: number;
    jti: string;
}

interface Picture {
    large: string;
    medium: string;
}

interface Image {
    large: string;
    medium: string;
}
