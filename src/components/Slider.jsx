import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';

const Slider = () => {
  return (
    <Splide
      options={{
        type   : 'loop',
        perPage: 1,
        perMove: 1,
      }}
    >
      <SplideSlide className="slide-container">
        <div className="slide">
          <img src="../src/images/character.jpg" alt="character" />
          <div className="slide__info">
            <h2 className="slide__title">Welcome!</h2>
            <div className='slide__text'>
              Hello! This is an introduction to the newbies. The first piece of advice I can give you is 
              <b> don't get overwhelmed</b>. Programming is a complex skill that might be overwhelming at
              first, however, with enough determination, anyone can learn it. <br />
              Now, this game is a super simplified version of a programming language, however, just by
              learning and understanding the basics, you will have a much easier time learning more complex
              languages.
            </div>
          </div>
        </div>
      </SplideSlide>
       <SplideSlide className="slide-container">
        <div className="slide slide--reverse">
        <img src="../src/images/books.jpg" alt="books" />
          <div className="slide__info">
            <h2 className="slide__title">What will you learn?</h2>
            <div className='slide__text'>
              During your say here you will learn: 
              <ol>
                <li>
                  Simple Instruction - Tell the character what to do.
                </li>
                <li>
                  Complex Instruction - Used to group multiple simple instructions.
                </li>
                <li>
                  Boolean Algebra - Calculate end result of a boolean equation using "and", "or", "not".
                </li>
                <li>
                  Branching Instruction "if" - Use evaluated boolean algebra to execute code conditionally.
                </li>
                <li>
                  Looping Instruction "while" - Use evaluated boolean algebra to execute code multiple times.
                </li>
                <li>
                  Code Execution Flow - How the code executes.
                </li>
                <li>
                  Errors - Types of errors, how to find them.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </SplideSlide>
      <SplideSlide className="slide-container">
      <div className="slide">
        <img src="../src/images/command.jpg" alt="commanding" />
          <div className="slide__info">
            <h2 className="slide__title">What is an instruction?</h2>
            <div className='slide__text'>
              <b>An instruction</b> is a command or a set of commands you give to someone. For example go into the
              code section above and write <code>walk left</code>, then click the "Run" button. As you can see,
              the character moved one space to the left. You can chain commands to create your own <b>code</b>. <br />
              There are two kind of instructions: <b>simple</b> and <b>complex</b>. <br /> In the context of this game,
              a simple instruction is composed of 2 parts: the command and the argument. The command tells the
              character what kind of action should it perform, then the argument, tells it how to perform it.
              For example you can use <code>walk left/right</code> to move the character, where "walk"
              is the command and "left", "right" are the arguments.
            </div>
          </div>
        </div>
      </SplideSlide>
      <SplideSlide className="slide-container">
      <div className="slide slide--reverse">
        <img src="../src/images/simple-instructions.jpg" alt="simple instructions" />
          <div className="slide__info">
            <h2 className="slide__title">Simple Instructions</h2>
            <div className='slide__text'>
              Lets take a look at all possible simple instructions: <br />
              'command' 'possible arguments' <br /> <br />

              <b>walk left/right</b> - walk in the specified direction <br />
              <b>jump left/up/right</b> - jump in the specified direction <br />
              <b>attack (no argument)</b> - unleashes an attack that can destroy crates

            </div>
          </div>
        </div>
      </SplideSlide>
      <SplideSlide className="slide-container">
      <div className="slide slide--reverse">
        <img src="../src/images/complex-instruction.jpg" alt="complex instruction" />
          <div className="slide__info">
            <h2 className="slide__title">What are complex instructions?</h2>
            <div className='slide__text'>
              Now that we understand what a simple instruction is, we can define a complex instruction. <br />
              A complex instruction is a container for multiple simple instructions. It starts with "&#123;"
              and ends with "&#125;", each typed on their own line. For example: <br />
              <code>
              &#123; <br />
              &nbsp;  walk left  <br /> 
              &nbsp;  jump right <br /> 
              &nbsp;  walk right <br /> 
              &#125; <br />
              </code> <br />
              Complex instructions are used in tandem with "if", "while" to execute multiple lines of code with
              just one "if" or "while" instruction.
            </div>
          </div>
        </div>
      </SplideSlide>
      <SplideSlide className="slide-container">
      <div className="slide slide--reverse">
        <img src="../src/images/play.jpg" alt="Image 2" />
          <div className="slide__info">
            <h2 className="slide__title">Runtime compiled arguments</h2>
            <div className='slide__text'>
              The title might be strange to you, however I can explain it to you. Runtime, means stuff that
              happens whilst the code is executed, so in simple words, runtime compiled arguments are arguments
              who's values change based on the current state of the game. Possible arguments are: 
              <code>facing_wall</code> - checks if the character is facing a wall. <br />
              <code>facing_diamond</code> - checks if the character is facing a diamond. <br />
              <code>facing_left, facing_right</code> - checks if the character is facing that direction. <br />
              <code>can_jump_up, can_jump_left, can_jump_right</code> - checks the blocks above for any obstacle
              that might pose a problem when jumping. <br />
              <code>on_platform</code> - checks if the character is on a non-brick platform <br />
              <code>on_floor</code> - checks if the character is on a brick floor <br />
            </div>
          </div>
        </div>
      </SplideSlide>
      <SplideSlide className="slide-container">
      <div className="slide slide--reverse">
        <img style={{objectFit: "contain"}} src="../src/images/boolean-algebra.jpg" alt="Image 2" />
          <div className="slide__info">
            <h2 className="slide__title">Boolean algebra</h2>
            <div className='slide__text'>
              All runtime compiled arguments convert to one of two states: true(1) or false(0). These values
              are called booleans and have specific operations you can apply to them: "and", "or", "not".
              The "and" and "or" operators are binary operators, which means, you need 2 arguments to evaluate
              to one value, one before it and one after. The not operator is a unary operator, so it only needs
              one, the one in front of it. Here are some tables to help you understand how each one works. <br />
              <table>
                <tr>
                  <td></td>
                  <td></td>
                  <td>and</td>
                </tr>
                <tr>
                  <td>true</td>
                  <td>true</td>
                  <td>true</td>
                </tr>
                <tr>
                  <td>true</td>
                  <td>false</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td>false</td>
                  <td>true</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td>false</td>
                  <td>false</td>
                  <td>false</td>
                </tr>
              </table>
              <table>
                <tr>
                  <td></td>
                  <td></td>
                  <td>or</td>
                </tr>
                <tr>
                  <td>true</td>
                  <td>true</td>
                  <td>true</td>
                </tr>
                <tr>
                  <td>true</td>
                  <td>false</td>
                  <td>true</td>
                </tr>
                <tr>
                  <td>false</td>
                  <td>true</td>
                  <td>true</td>
                </tr>
                <tr>
                  <td>false</td>
                  <td>false</td>
                  <td>false</td>
                </tr>
              </table>
              <table>
                <tr>
                  <td></td>
                  <td>not</td>
                </tr>
                <tr>
                  <td>true</td>
                  <td>false</td>
                </tr>
                <tr>
                  <td>false</td>
                  <td>true</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </SplideSlide>
      <SplideSlide className="slide-container">
      <div className="slide slide--reverse">
        <img src="../src/images/character-facing-wall.jpg" alt="Image 2" />
          <div className="slide__info">
            <h2 className="slide__title">Using boolean algebra</h2>
            <div className='slide__text'>
              Lets say we have an instance in our game where the player is positioned like in the image beside us.
              If we evaluate <code>facing_wall</code>, we get true. If we evaluate <code>on_platform</code>, we
              get false, since the character is on a brick floor. Now, if we want to evaluate the following
              statement <code>facing wall and on_platform</code>, we get "true and false", which going back to
              the tables, gives us false. Just like addition and multiplication have different importance levels,
              so do the boolean operators, which are calculated in the following order: 1 - not, 2 - and, 3 - or.
              If we had the following statement <code>on_floor or not facing_wall and can_jump_up</code> we would
              calculate it as follows: "true or not true and true" = "true or false and true" = "true or 
              false" = "true".

            </div>
          </div>
        </div>
      </SplideSlide>
    </Splide>
  );
};

export default Slider;
