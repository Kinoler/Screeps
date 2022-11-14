export class Extensions {
    static *GetPositionsByCircle(roomPosition: RoomPosition)
    {
        var x = roomPosition.x;
        var y = roomPosition.y;
        var roomName = roomPosition.roomName;

        yield new RoomPosition(x + 1, y + 1, roomName)
        yield new RoomPosition(x, y + 1, roomName)
        yield new RoomPosition(x - 1, y + 1, roomName)

        yield new RoomPosition(x + 1, y, roomName)
        yield new RoomPosition(x - 1, y, roomName)

        yield new RoomPosition(x + 1, y - 1, roomName)
        yield new RoomPosition(x, y - 1, roomName)
        yield new RoomPosition(x - 1, y - 1, roomName)
    }
}
