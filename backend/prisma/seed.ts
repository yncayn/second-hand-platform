import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

    // 초기화 (FK 순서 고려)

    await prisma.chatMessage.deleteMany();
    await prisma.chatRoom.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.report.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash('1234', 10);

    //////////////////////////////////////////////////////
    // USER
    //////////////////////////////////////////////////////

    const admin = await prisma.user.create({
        data: {
        email: 'admin@test.com',
        password,
        nickname: '관리자',
        bio: 'Administrator',
        role: 'ADMIN'
        }
    });

    const user1 = await prisma.user.create({
        data: {
        email: 'user1@test.com',
        password,
        nickname: '혜인',
        bio: '맥북 판매합니다.'
        }
    });

    const user2 = await prisma.user.create({
        data: {
        email: 'user2@test.com',
        password,
        nickname: '철수',
        bio: '직거래 환영'
        }
    });

    const user3 = await prisma.user.create({
        data: {
        email: 'user3@test.com',
        password,
        nickname: '영희',
        bio: '안전거래 좋아요'
        }
    });

    //////////////////////////////////////////////////////
    // PRODUCT
    //////////////////////////////////////////////////////

    const p1 = await prisma.product.create({
        data: {
        seller_id: user1.user_id,
        product_name: 'MacBook Air M2',
        product_description: '상태 A급, 박스 포함',
        price: 850000,
        category: 'DIGITAL'
        }
    });

    const p2 = await prisma.product.create({
        data: {
        seller_id: user2.user_id,
        product_name: 'Nintendo Switch OLED',
        product_description: '실사용 2개월',
        price: 280000,
        category: 'DIGITAL'
        }
    });

    const p3 = await prisma.product.create({
        data: {
        seller_id: user1.user_id,
        product_name: 'AirPods Pro2',
        product_description: '생활기스 있음',
        price: 180000,
        category: 'DIGITAL',
        status: 'SOLD'
        }
    });

    const p4 = await prisma.product.create({
        data: {
        seller_id: user3.user_id,
        product_name: '클린코드',
        product_description: '깨끗한 책입니다.',
        price: 18000,
        category: 'BOOK'
        }
    });

    const p5 = await prisma.product.create({
        data: {
        seller_id: user2.user_id,
        product_name: '나이키 덩크',
        product_description: '270 사이즈',
        price: 120000,
        category: 'FASHION'
        }
    });

    //////////////////////////////////////////////////////
    // PRODUCT IMAGE
    //////////////////////////////////////////////////////

    await prisma.productImage.createMany({
        data: [
        {
            product_id: p1.product_id,
            image_url: '/uploads/macbook.webp'
        },
        {
            product_id: p2.product_id,
            image_url: '/uploads/switch.webp'
        },
        {
            product_id: p3.product_id,
            image_url: '/uploads/airpods.webp'
        },
        {
            product_id: p4.product_id,
            image_url: '/uploads/book.jpg'
        },
        {
            product_id: p5.product_id,
            image_url: '/uploads/nike.jpg'
        }
        ]
    });

    //////////////////////////////////////////////////////
    // CHAT ROOM
    //////////////////////////////////////////////////////

    const room1 = await prisma.chatRoom.create({
        data: {
        product_id: p1.product_id,
        buyer_id: user2.user_id
        }
    });

    const room2 = await prisma.chatRoom.create({
        data: {
        product_id: p2.product_id,
        buyer_id: user3.user_id
        }
    });

    //////////////////////////////////////////////////////
    // CHAT MESSAGE
    //////////////////////////////////////////////////////

    await prisma.chatMessage.createMany({
        data: [
        {
            chatroom_id: room1.chatroom_id,
            sender_id: user2.user_id,
            message: '안녕하세요. 아직 판매중인가요?'
        },
        {
            chatroom_id: room1.chatroom_id,
            sender_id: user1.user_id,
            message: '네 판매중입니다.'
        },
        {
            chatroom_id: room1.chatroom_id,
            sender_id: user2.user_id,
            message: '오늘 거래 가능할까요?'
        },
        {
            chatroom_id: room2.chatroom_id,
            sender_id: user3.user_id,
            message: '직거래 가능할까요?'
        },
        {
            chatroom_id: room2.chatroom_id,
            sender_id: user2.user_id,
            message: '가능합니다.'
        }
        ]
    });

    //////////////////////////////////////////////////////
    // TRANSACTION
    //////////////////////////////////////////////////////

    await prisma.transaction.create({
        data: {
        product_id: p3.product_id,
        buyer_id: user2.user_id,
        amount: 180000,
        status: 'COMPLETED'
        }
    });

    //////////////////////////////////////////////////////
    // REPORT
    //////////////////////////////////////////////////////

    await prisma.report.create({
        data: {
        reporter_id: user2.user_id,
        target_product_id: p1.product_id,
        report_type: 'PRODUCT',
        reason: 'SPAM',
        content: '중복 게시글입니다.',
        status: 'COMPLETED'
        }
    });

    await prisma.report.create({
        data: {
        reporter_id: user3.user_id,
        target_user_id: user2.user_id,
        report_type: 'USER',
        reason: 'ABUSE',
        content: '욕설을 했습니다.',
        status: 'PENDING'
        }
    });

    console.log('✅ Seed Complete');
    }

    main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });