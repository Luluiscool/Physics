const createMass = function(pos = vec2())
{
    return {
        pos : pos,

        oldpos : pos,

        acceleration : vec2(),

        render : function()
        {
            sl.Render(sl.Circle(this.pos, 5, albedo(1,1,1,1)));
        },

        update : function(dt = 1)
        {
            const velocity = vec2(this.pos.x - this.oldpos.x, this.pos.y - this.oldpos.y);

            this.oldpos = this.pos;

            this.pos = this.pos.add(vec2(velocity.x * Friction.x, velocity.y * Friction.y)).add(vec2(this.acceleration.x * dt * dt, this.acceleration.y * dt * dt));

            this.acceleration = vec2();
        },

        accelerate : function(acc = vec2())
        {
            this.acceleration = vec2(this.acceleration.x + acc.x, this.acceleration.y + acc.y);
        },

        applyConstraint : function()
        {
            if(this.pos.y > sl.height - 100)
            {
                this.pos.y = sl.height - 100;
            }

            if(this.pos.y < 0)
            {
                this.pos.y = 0;
            }

            if(this.pos.x < 0)
            {
                this.pos.x = 0;
            }

            if(this.pos.x > sl.width)
            {
                this.pos.x = sl.width;
            }
        },

        Edit : function()
        {
            if(sl.mouse.held)
            {
                let n = this.pos.distance(vec2(sl.mouse.x, sl.mouse.y)) < 20;

                if(locked === null && n)
                {
                    locked = this;
                }

            }

            else
            {
                locked = null;
            }

            if(locked !== null)
            {
                locked.pos = vec2(sl.mouse.x, sl.mouse.y);
                locked.oldpos = vec2(sl.mouse.x, sl.mouse.y);
            }
        }
    }
}

const physicsObject = function(points = [createMass()], sticks = [[0,0]], rest = [0])
{
    return {
        points : points,

        sticks : sticks,

        rest : rest,

        render : function()
        {
            for(let i = 0; i < this.sticks.length; i ++)
            {
                const a = this.points[this.sticks[i][0]];
                const b = this.points[this.sticks[i][1]];

                sl.Render(sl.Line(a.pos, b.pos, albedo(1,1,1,1)));
                a.render();
                b.render();
            }
        },

        update : function(dt = 1, FirstFrame)
        {
            for(let i = 0; i < this.sticks.length; i ++)
            {
                // Reference to both of the sticks
                
                const a = this.points[this.sticks[i][0]];
                const b = this.points[this.sticks[i][1]];

                // Calculating the angle distance between the sticks

                const delta = vec2(a.pos.x - b.pos.x, a.pos.y - b.pos.y); // delta from B -> A

                const dist = delta.magnitude(); // The magnitude of delta is the distance between the points

                const angle = vec2(delta.x / dist, delta.y / dist); // Normalizing the delta to get the angle (unit vector)

                // If the distance between the points are different from their rest length (ignoring the value after decimal)

                if(Math.floor(dist) != Math.floor(this.rest[i]))
                {
                    // Moving both of the points half way apart
                    
                    const distToMove = (dist - this.rest[i]) * (Stiffness) / 2;

                    a.pos = vec2(a.pos.x - (angle.x * distToMove), a.pos.y - (angle.y * distToMove));

                    b.pos = vec2(b.pos.x + (angle.x * distToMove), b.pos.y + (angle.y * distToMove));
                }
            }

            // Updating the points independent to their connection index

            for(let i = 0; i < this.points.length; i ++)
            {
                if(locked != this.points[i])
                {
                    this.points[i].applyConstraint();
                    this.points[i].update(dt);
                    this.points[i].accelerate(Gravity);
                }


                if(FirstFrame)
                this.points[i].Edit();

                // Doing the O(n^2) algorith to solve (but with -x / 2 offset in the complexity)

                const a = this.points[i];

                for(let j = i + 1; j < this.points.length; j ++)
                {
                    const b  = this.points[j];

                    // If the distance between the points is very close
                    const dst = a.pos.distance(b.pos)
                    if(dst < 20)
                    {
                        // Calculate the angle and Move them apart

                        const angle = vec2((a.pos.x - b.pos.x) / dst, (a.pos.y - b.pos.y) / dst);

                        a.pos = vec2(a.pos.x - (angle.x * 10), a.pos.y - (angle.y * 10));
                        b.pos = vec2(b.pos.x + (angle.x * 10), b.pos.y + (angle.y * 10));
                    }
                }
            }
        },
    }
}

const Gravity = vec2(0, 1);
let locked = null;
let Stiffness = 1;
const Friction = vec2(0.995);
