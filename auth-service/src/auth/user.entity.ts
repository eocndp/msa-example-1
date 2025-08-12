import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as bcrypt from 'bcrypt'

@Schema()
export class User extends Document {
    @Prop({ required: true, unique: true })
    username: string

    @Prop({ required: true })
    password: string

    comparePassword: (candidate: string) => Promise<boolean>
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password)
}
